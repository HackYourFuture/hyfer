# Permissions and Roles
> Permissions are a set of roles that makes the ability for the visitors, users or admins to have the right access to the right data.
## roles in front-end
 - By default *'public'* permission is granted automatically, with this scope of permissions it will grant the ability to read from the *timeline* page with no access to any sensitive data.
 - Once the Visitor signed in he will have a user *'guest'* role, with this scope the user have a grant to some of his own data and the ability to read or change it.
 - improved *'student'* plus the ability of improving the previous scopes he can also see and improve other students Homeworks, and read some extra modules details.
 - a *'teacher'* can manage all the previous scopes with there informations, the modules, the timeline and the users Grants.

|Permission|department|public|guest|student|teacher|
|:---------|:--------:|:----:|:---:|:-----:|:-----:|
|Read|Timeline page|✅|✅|✅|✅|
|Manage|Timeline page|❌|❌|❌|✅|
|Read|Owned profile|✅|✅|✅|✅|
|Manage|Owned profile|✅|✅|✅|✅|
|Read|Users info|❌|❌|❌|✅|
|Manage|Users info|❌|❌|❌|✅|
|Manage|Users grants|❌|❌|❌|✅|
|Read|Modules Detailes|❌|❌|✅|✅|
|Manage|Modules Detailes|❌|❌|❌|✅|
|Read|Homework page|❌|❌|✅|✅|
|Manage|Homework page|❌|❌|✅|✅|