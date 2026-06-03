# Crisol-Eco

Esqueleto de ecosistema autónomo para proyectos OpenCode.

**Agentes pocos. Skills muchas. Dominios simples. Contexto local mínimo.**

## Agentes

| Agente | Rol |
|---|---|
| **North** | Orquestador. No toca código. Planifica, delega, decide. |
| **Executor** | Ejecutor técnico. Implementa, refactoriza, debuggea. |
| **Auditor** | Revisor. Analiza riesgos, no modifica código. |

## Skills nativas

| Skill | Para qué |
|---|---|
| `econative-plan-and-decompose` | Intención → Plan → Fases → Tareas |
| `econative-architecture-review` | Límites, acoplamiento, flujo, impacto |
| `econative-parallel-dispatch` | Detectar independencia y lanzar en paralelo |
| `econative-debug-systematic` | Debugging metódico |
| `econative-implement-safe` | Implementación segura |
| `econative-test-and-validate` | Testing y validación |

## Plugins (tools)

| Tool | Qué hace |
|---|---|
| `econative_start_session` | Inicio obligatorio — carga contexto, memorias, preferences |
| `econative_save_preferences` | Guarda nombre e idioma del usuario |
| `econative_stack_snapshot` | Toma snapshot del stack y archiva versiones anteriores |
| `econative_remember_it` | Guarda recuerdo compartido con fecha e importancia |
| `econative_remember_here` | Lee recuerdos guardados con filtros |
| `econative_task_init` | Registra tarea en el log del sistema |
| `econative_task_closeout` | Marca tarea como completada |
| `econative_domain_list` | Escanea dominios y devuelve lista con título y descripción |
| `econative_domain_reader` | Lee dominio por nombre |

## Comandos

| Comando | Qué hace |
|---|---|
| `scan-stack` | Toma snapshot del stack del proyecto |
| `remember-it` | Guarda un recuerdo en la memoria compartida |
| `remember-here` | Lee recuerdos guardados |

## Estructura

```
.opencode/
├── AGENTS.md                ← Puerta de entrada
├── agents/                  ← North, Executor, Auditor
├── skills/
│   ├── native/              ← Skills nativas del ecosistema
│   │   ├── north/           ← Skills para North
│   │   └── executor/        ← Skills para Executor
│   └── extern/              ← Skills de terceros (futuro)
├── plugins/                 ← 9 tools como plugins .ts
├── context/                 ← Estado del proyecto
│   ├── PROJECT.md
│   ├── CONVENTIONS.md
│   ├── ARCHITECTURE.md
│   └── STATUS.md
├── domains/                 ← Dominios markdown planos
├── Memoria/
│   ├── preferences-user/    ← Nombre, idioma del usuario
│   ├── stack/               ← Snapshots del stack
│   │   └── snapshots-old/
│   ├── discoveries/         ← North escribe automático
│   ├── decision-records/    ← ADRs ligeros por North
│   └── task-log/            ← Log de tareas activas/completadas
├── commands/
└── package.json
```

## Instalación

```bash
cd mi-proyecto/
git clone <repo-url> .opencode
```

Al abrir `mi-proyecto/` en OpenCode:
- Los agentes se cargan desde `agents/`
- Las skills en `skills/native/` se registran automáticamente
- Los plugins en `plugins/` se compilan como tools
- Los dominios se consultan bajo demanda

## Filosofía

```
North = dirección
Executor = operación
Auditor = control
Skills = cómo trabajar
Domains = qué saber
Context = estado del proyecto
Memoria = buffer entre efímero y permanente
Work = trabajo temporal
```

> La memoria pesada queda fuera del ecosistema local.
> Esto es publicable, clonable, mantenible.

## MCPs integrados

| MCP | Tool | Propósito | Config |
|---|---|---|---|
| `seq-thinking` | `sequential_thinking` | Razonamiento estructurado multi-paso solo para tareas complejas | `opencode.json` > `mcpServers.seq-thinking` |
