from django.urls import path
from .views.attemptViews import GetAllAddAttemptsByUserView, GetByIdUpdateDeleteAttemptsView
from .views.userViews import get_update_delete_user, getall_add_user
from .views.authViews import signup, signin, verify

urlpatterns = [
    path("auth/signup", signup),
    path("auth/signin", signin),
    path("auth/verify", verify),

    path("users", getall_add_user),
    path("users/<uuid:id>", get_update_delete_user),

    path("attempts", GetAllAddAttemptsByUserView.as_view()),
    path("attempts/<uuid:id>", GetByIdUpdateDeleteAttemptsView.as_view()),
]