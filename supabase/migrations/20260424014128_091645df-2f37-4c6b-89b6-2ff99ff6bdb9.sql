CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  requested_role text;
  final_role public.app_role;
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), coalesce(new.raw_user_meta_data->>'phone',''));

  requested_role := coalesce(new.raw_user_meta_data->>'role', 'patient');

  -- Only allow self-selection of safe roles. Admin must be assigned manually.
  if requested_role in ('patient','doctor','receptionist') then
    final_role := requested_role::public.app_role;
  else
    final_role := 'patient'::public.app_role;
  end if;

  insert into public.user_roles (user_id, role) values (new.id, final_role);
  return new;
end $function$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();