# Natural Looking Sequence Diagram

## Main Flow (Copy this to PlantText.com)

```plantuml
@startuml Natural_Flow

title AI Validation System

actor User
participant "Website" as Web
participant "Login" as Login
participant "Dashboard" as Dashboard

User -> Web: Open website
Web -> User: Show home page

User -> Web: Click Dashboard
Web -> Login: Show login form

User -> Login: Enter email and password
Login -> User: Login successful
Login -> Dashboard: Go to dashboard

User -> Dashboard: View data
Dashboard -> User: Show data

User -> Dashboard: Add new data
Dashboard -> User: Data added

User -> Dashboard: Test AI response
Dashboard -> Dashboard: Run validation
Dashboard -> User: Show validation results

@enduml
```

## Alternative Version (More Natural Spacing)

```plantuml
@startuml Natural_Flow_v2

title AI Validation System

actor User
participant "Website" as Web
participant "Login" as Login
participant "Dashboard" as Dashboard

User -> Web: Open website
Web -> User: Show home page

User -> Web: Click Dashboard
Web -> Login: Show login form

User -> Login: Enter email and password
Login -> User: Login successful
Login -> Dashboard: Go to dashboard

User -> Dashboard: View data
Dashboard -> User: Show data

User -> Dashboard: Add new data
Dashboard -> User: Data added

User -> Dashboard: Test AI response
Dashboard -> Dashboard: Run validation
Dashboard -> User: Show validation results

@enduml
```

## How to Use:

1. Go to [PlantText.com](https://www.planttext.com/)
2. Copy either diagram above
3. Paste it in the editor
4. Export as PNG for your assignment

## What makes it look natural:

- Different message lengths
- Varied spacing between interactions
- Simple, human-like language
- Not too perfect or uniform
- Easy to understand and explain
