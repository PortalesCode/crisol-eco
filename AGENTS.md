# Crisol-Eco — Ecosystem

## Agentes disponibles

| Agente | Modo | Rol |
|---|---|---|
| `North` | primary | Orquestador. No toca código. Planifica, delega, decide. |
| `Executor` | subagent | Ejecutor técnico. Implementa, refactoriza, debuggea. |
| `Auditor` | subagent | Revisor. Analiza, detecta riesgos, no modifica código. |

## Skills disponibles (nativas)

| Skill | Usada por | Propósito |
|---|---|---|
| `native/north/econative-plan-and-decompose` | North | Planificar intención → fases → tareas |
| `native/north/econative-architecture-review` | North | Revisar arquitectura y detectar riesgos |
| `native/north/econative-parallel-dispatch` | North | Detectar independencia y lanzar ejecutores paralelos |
| `native/executor/econative-implement-safe` | Executor | Implementación segura (workspace, reglas, rollback) |
| `native/executor/econative-debug-systematic` | Executor | Debugging metódico (6 pasos + antipatrones) |
| `native/executor/econative-test-and-validate` | Executor | Testing y validación con comandos por lenguaje |
| `native/auditor/econative-audit-review` | Auditor | Revisión estructurada (6 dimensiones + informe) |

## Plugins disponibles (tools)

| Tool | Qué hace |
|---|---|
| `econative_start_session` | **Obligatorio** al inicio. Carga contexto, memorias, stack, preferences |
| `econative_save_preferences` | Guarda nombre e idioma del usuario en Memoria/preferences-user/ |
| `econative_stack_snapshot` | Escanea stack, escribe current.json y archiva snapshots viejos |
| `econative_remember_it` | Guarda recuerdo compartido con fecha, tags e importancia |
| `econative_remember_here` | Lee recuerdos compartidos con filtros |
| `econative_task_init` | Registra tarea en el log del sistema |
| `econative_task_closeout` | Marca tarea como completada en el log |
| `econative_domain_list` | Escanea .opencode/domains/ y devuelve lista de dominios con título y descripción |
| `econative_domain_reader` | Lee contenido completo de un dominio |

## Comandos disponibles

| Comando | Qué hace |
|---|---|
| `scan-stack` | Toma un snapshot del stack del proyecto |
| `remember-it` | Guarda un recuerdo en la memoria compartida |
| `remember-here` | Lee recuerdos guardados |

## Dominios disponibles

Los dominios viven en `.opencode/domains/`. Consultar `econative_domain_list` antes de usar websearch. Leer dominio completo solo si es relevante para la tarea actual.



## Contexto del proyecto

| Archivo | Propósito | Lo escribe |
|---|---|---|
| `context/PROJECT.md` | Qué es el proyecto, stack, objetivos | North |
| `context/CONVENTIONS.md` | Reglas del repo | North |
| `context/ARCHITECTURE.md` | Arquitectura actual | North |
| `context/STATUS.md` | Estado actual, pendientes, issues | North |

## Memoria del ecosistema

| Ruta | Propósito | Lo escribe |
|---|---|---|
| `Memoria/preferences-user/config.json` | Preferencias del usuario (nombre, idioma) | North via tool |
| `Memoria/stack/current.json` | Snapshot actual del stack | North via tool / comando |
| `Memoria/stack/snapshots-old/` | Snapshots anteriores del stack | Tool automático |
| `Memoria/discoveries/` | Descubrimientos y recuerdos compartidos (fecha, tags, importancia) | North via tool / comando |
| `Memoria/decision-records/` | Decisiones arquitectónicas relevantes | North directo |

## Flujo de inicio de sesión

1. **North** llama **`econative_start_session`**
2. Si `onboarding_required` → pregunta nombre e idioma → `econative_save_preferences`
3. North revisa contexto, stack, memorias y recuerdos
4. North espera la intención del usuario

## Flujo de trabajo

1. **North** recibe intención del usuario
2. **North** consulta skills, dominios y contexto
3. Si la tarea es **compleja** (múltiples tradeoffs, caminos no obvios) → **North** usa `sequential_thinking` para razonar primero
4. **North** planifica con `econative-plan-and-decompose`
5. **North** decide paralelismo y asigna **Executor(s)** con `task()`
6. **Executor** ejecuta aplicando skills correspondientes
7. Si amerita → **North** invoca **Auditor** para revisión
8. **North** decide qué persistir
9. **task-closeout** marca la tarea como completada

## Tools nativas de OpenCode

| Tool | Para qué | Config |
|---|---|---|
| `question()` | Preguntar al usuario con opciones o texto libre | `opencode.json` > `permission.question: allow` |
| `sequential_thinking` | Razonamiento estructurado multi-paso, solo para tareas complejas | `opencode.json` > `mcp.seq-thinking` |

## Engram — memoria persistente (heredado de la config global)

Engram está disponible para TODOS los agentes del ecosistema (North, Executor, Auditor). Heredado del `~/.config/opencode/AGENTS.md` global.

| Herramienta | Para qué |
|---|---|
| `mem_save(title, type, content, topic_key?)` | Guardar decisión, bugfix, descubrimiento entre sesiones |
| `mem_search(query)` | Buscar en memoria persistente por texto |
| `mem_get_observation(id)` | Ver contenido completo de un recuerdo |
| `mem_context()` | Ver sesiones recientes |
| `mem_session_summary(content)` | Cerrar sesión con resumen estructurado |
| `mem_suggest_topic_key(title, type)` | Obtener key estable para upserts |
| `mem_doctor()` | Diagnóstico del estado de Engram |

**Diferencia con tools econativas:**
- `mem_save` / `mem_search` → persisten entre sesiones de OpenCode. Lo que guardás hoy aparece mañana.
- `econative_remember_it` / `discoveries/` → persisten dentro del ecosistema `.opencode/Memoria/`. Son locales al proyecto.
- Usá Engram para **hechos rápidos** ("decidimos X"). Usá discoveries para **conocimiento del proyecto** ("el puerto default es 8080").

## Notas

- Los agentes se cargan automáticamente desde `agents/`
- Las skills en `skills/native/` se registran automáticamente
- Los plugins en `plugins/` se compilan y exponen como tools
- Los dominios se consultan bajo demanda, no se inyectan en el prompt
- Las skills de terceros van en `skills/extern/`
- La memoria pesada queda fuera del ecosistema local
