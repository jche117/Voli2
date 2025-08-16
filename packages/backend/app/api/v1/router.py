from fastapi import APIRouter

from app.modules.users import router as users_router
from app.modules.contacts.api.v1 import router as contacts_router
from app.modules.tasks import router as tasks_router
from app.modules.roles import router as roles_router
from app.modules.assets import router as assets_router
from app.modules.task_templates import router as task_templates_router
# from app.modules.reports import router as reports_router
# from app.modules.learning import router as learning_router

api_router = APIRouter()
api_router.include_router(users_router.router, prefix="/users", tags=["users"])
api_router.include_router(contacts_router.router, prefix="/contacts", tags=["contacts"])
api_router.include_router(tasks_router.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(roles_router.router, prefix="/roles", tags=["roles"])
api_router.include_router(assets_router.router, prefix="/assets", tags=["assets"])
api_router.include_router(task_templates_router.router, prefix="/templates", tags=["templates"])
# api_router.include_router(reports_router.router, prefix="/reports", tags=["reports"])
# api_router.include_router(learning_router.router, prefix="/learning", tags=["learning"])