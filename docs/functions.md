# Functions

## create_profile_for_user
```sql
BEGIN
  INSERT INTO public.profiles(id, email)
  VALUES (new.id, new.email);
  RETURN NEW;
END;
```

## reset_registration_fields
```sql
create
or replace function public.reset_registration_fields (r_id uuid) returns text language plpgsql as $$
DECLARE
    v_error text;
BEGIN
    BEGIN
        UPDATE public.registrations
        SET 
            secondment = NULL,
            "group" = NULL,
            receipt_url = NULL,
            note = NULL,
            status = 'pending'
        WHERE id = r_id;
    EXCEPTION WHEN others THEN
        GET STACKED DIAGNOSTICS v_error = MESSAGE_TEXT;
        RETURN v_error;
    END;
    RETURN 'Success';
END;
$$;
```

## total_profiles_and_admins
```sql
BEGIN
  RETURN QUERY
  SELECT 
    CAST(COUNT(CASE WHEN NOT is_admin THEN 1 END) as INTEGER) as total_profiles,
    CAST(COUNT(CASE WHEN is_admin THEN 1 END) as INTEGER) as total_admins
  FROM profiles;
END;
```