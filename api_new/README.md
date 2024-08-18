```mermaid
graph TD
    C[Client]
    C -->|Requests| AS[Auth Service]
    C -->|Requests| AI[AI Service]
    C -->|Requests| CC[CC Service]
    AS -->|User/Org Data| DB[(User/Org DB)]
    AI -->|AI Data| AIDB[(AI DB)]
    CC -->|CC Data| CCDB[(CC DB)]
    AI -->|Token Verification| AS
    CC -->|Token Verification| AS
```
