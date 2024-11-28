npm i react-sparklines
npm i react-toastify


Plan:
    Users:
        
        Fields: [fname, lname, designation, company, email(key), password],
        
        hidden: [Guid, status(active or blocked), LastLogin, previousLoginDates, createdAt]
    
    Features:
        Sort
        Search Index(filter)
        more...

Questions: 
    Block list?
    create unique index?
    Filter: is this a search field??









---





Task #4 (ALL GROUPS) 

Use language and platform FOR YOU GROUP: 

JavaScript or TypeScript, React, PostgreSQL or MySQL or any database (see below),
C#, .NET, some kind ASP.NET, SQL Server or any database.

THE FIRST REQIUREMENT: YOU NEED TO CREATE A UNIQUE INDEX IN DATABASE.

THE SECOND REQUIREMENT: YOUR TABLE SHOULD LOOK LIKE TABLE AND YOUR TOOLBAR SHOULD LOOK LIKE TOOLBAR.

THE THIRD REQUIREMENT: DATA IN THE TABLE SHOULD BE SORTED (E.G., BY THE LAST LOGIN TIME).

THE FOURTH REQUIREMENT: MULTIPLE SELECTION SHOULD BE IMPLEMENTED USING CHECKBOXES (SELECT ALL/DELECT ALL IS ALSO A CHECKBOX).

THE FIFTH REQUIREMENT: BEFORE EACH REQUEST EXCEPT FOR REGISTRATION OR LOGIN, SERVER SHOULD CHECK IF USER EXISTS AND ISN'T BLOCKED (if user account is blocked or deleted, any next user’s request should redirect to the login page).

Create a working and deployed (remotely accessible) Web application with user registration and authentication.

Non-authenticated users should not have access to the user management (admin panel). They have only access to login form or registration form.

Only authenticated users should have access the user management table with at least the following fields: (selection checkbox), name, e-mail, last login time, status (active/blocked). You also may add registration time, some sparkline for activity, etc. (optional).

The leftmost column of the table should contains checkboxes without labels for multiple selection (table header contains only checkbox without label that selects or deselects all the records).

There must be a toolbar over the table with the following actions: Block (button with text), Unblock (icon), Delete (icon).

You have to use any CSS framework (Bootstrap is recommended, but you can choose any CSS framework).

All users should be able to block or delete themselves or any other user.


User can use any non-empty password (even one character).

Blocked user should not be able to login, deleted user can re-register.

JUST IN CASE: YOU HAVE TO CREATE A UNIQUE INDEX IN THE DATABASE. NOT TO CHECK WITH YOU CODE FOR UNIQUENESS, BUT CREATE THE INDEX.

YOU STORAGE SHOULD GUARANTEE E-MAIL UNIQUENESS INDEPENDENTLY OF HOW MANY SOURCES PUSH DATA INTO IT SIMULTANEOUSLY. 

Generally, you can use any "architecture", either implement a classic Web-application with a server and a database or separate front from back. It's not important in this task. Generally, it's the most simple and straightforward to use a relational DB, e.g. PostgreSQL or MySQL. You can, if you wish, use anything else. E.g., MongoDB, but it really won't give you any advantage in this task (you just deprive yourself a very major skill). But you can. Or you can even try use some SaaS like Firebase. But be careful, you easily will get into some troubles. E.g.,  if you decide to use "out-of-the-box" users, it may be problematic to delete them. If you decide to use custom "users", you may have some problems with maintaining uniquieness of e-mails, etc. I have to remind, that you code can contain only error processing and management of uniqueness have to be performed on the storage level, but you code shouldn't contain checks whether the e-mail already exists. Arguably, the simplest solution is to use a classic boring "trivial" relational database. But even in Firebase you may try to create documents that uses e-mails as keys (again, it limits you ability to change e-mail by user request, etc.). 
NO WALLPAPERS. NO ANIMATIONS. NO BROWSER ALERTS. NO BUTTONS IN THE DATA ROWS.

Your application should work properly in different browsers and on different resolutions (desktop/mobile). However, you have to get that automagically by properly using CSS framework like Bootstrap.

DON'T INVENT ANYTHING, USE LIBRARIES FOR EVERYTHING.

Implement:
adequate error messages;
tooltips;
status messages (informing user about succesful operation).


Users shouldn't be "kicked" right away. They should be "kicked" when they try to perform some action. For example, if I look at user list while somebody else blocked me (or I block itself from other browser), I can continue to stare at the users list as long as I want. But if I try to block or unblock somebody, I must be redirected to login page with the correspoding notification. You have to check before any server request that user exists and isn't blocked.


How to submit the solution
Send to p.lebedev@itransition.com:
Full name.
Link to source code.
Link to the deployed project (you can use any hosting you find suitable — azure, amazon, render, somee, vercel, netlify, anything).
Recorded video: registration, login, non-current user selection, user blocking (the user status should be updated), user unblocking, all user selection (including current), all user blocking (with automatic redirection to the login page), demonstration of the index created in the database (if you use storage that doesn't support indices, demonstrate the solution using  documents with e-mail as keys or some kind of triggers – any solution that will guarantee consitency on the storage level).

PLEASE, MAKE SURE THAT YOUR VIDEO CONTAINS DEMONSTRATION OF THE INDEX IN THE DATABASE AS WELL AS PLACE IN THE CODE THAT CATCHES THE CORRESPONING ERROR AND SHOW AN APPROPRIATE MESSAGE. IF YOU USE SOME STORAGE NOT VERY SUITED FOR THIS TASKS THAT DOESN'T SUPPORT INDICES, DEMONSTRATE YOUR TRIGGERS OR DOCUMENTS THAT USES E-MAILS AS KEYS, ETC.

Deadlines for this task and the rest of the tasks are the same — before the project start (you can check the schedule).

Why all users are admins, isn't that strange? Yes, kinda, in reality it won't be implemented this way. But here are two reasons:
1) To simplify testing (for you and for me).
2) To simplify your work, because you don't need to think about user roles (in this task).

However, the admin ability to delete themselves is very real and very ofter required — if you have no idea why, you may ask. 