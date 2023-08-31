# Functions

## create_profile_for_user
```sql
BEGIN
  INSERT INTO public.profiles(id, email)
  VALUES (new.id, new.email);
  RETURN NEW;
END;
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