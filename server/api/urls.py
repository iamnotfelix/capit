from django.urls import path
from .views.attemptViews import GetAllAddAttemptsView, GetByIdUpdateDeleteAttemptsView
from .views.userViews import get_update_delete_user, getall_add_user

urlpatterns = [
    path("users", getall_add_user),
    path("users/<uuid:id>", get_update_delete_user),
    path("attempts", GetAllAddAttemptsView.as_view()),
    path("attempts/<uuid:id>", GetByIdUpdateDeleteAttemptsView.as_view()),
]