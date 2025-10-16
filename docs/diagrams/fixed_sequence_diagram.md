# Fixed Sequence Diagram for PlantText

## Working Version (Copy this to PlantText.com)

```plantuml
@startuml
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

## Alternative Simple Version

```plantuml
@startuml
title AI System Flow

actor User
participant Website
participant Login
participant Dashboard

User -> Website: Open website
Website -> User: Show home page

User -> Website: Click Dashboard
Website -> Login: Show login form

User -> Login: Enter email and password
Login -> User: Login successful
Login -> Dashboard: Go to dashboard

User -> Dashboard: View data
Dashboard -> User: Show data

User -> Dashboard: Add new data
Dashboard -> User: Data added

User -> Dashboard: Test AI response
Dashboard -> User: Show results

@enduml
```

## How to Use:

1. Go to [PlantText.com](https://www.planttext.com/)
2. Copy the code above (without the markdown backticks)
3. Paste it in the editor
4. The diagram should work now!

## What I Fixed:

- Removed the diagram name after @startuml
- Made sure all syntax is correct
- Simplified the participant names
- Fixed the structure

Try the first version - it should work perfectly now!
