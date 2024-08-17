# # app/api/v1/endpoints/api_tokens.py
# from typing import List

# from fastapi import APIRouter, Depends, HTTPException

# from app.core.dependencies import get_db_and_current_user
# from app.crud.api_token import api_token
# from app.schemas.api_token import APIToken, APITokenCreate

# router = APIRouter(
#     prefix="/tokens", tags=["tokens"], dependencies=[Depends(get_db_and_current_user)]
# )


# @router.post("", response_model=APIToken)
# async def create_api_token(
#     token_in: APITokenCreate, deps: dict = Depends(get_db_and_current_user)
# ):
#     db = deps["db"]
#     current_user = deps["current_user"]
#     return await api_token.create_token(db, obj_in=token_in, user_id=current_user.id)


# @router.get("", response_model=List[APIToken])
# async def list_api_tokens(deps: dict = Depends(get_db_and_current_user)):
#     db = deps["db"]
#     current_user = deps["current_user"]
#     return await api_token.get_tokens_for_user(db, user_id=current_user.id)


# @router.delete("/{token_id}", response_model=APIToken)
# async def delete_api_token(
#     token_id: int, deps: dict = Depends(get_db_and_current_user)
# ):
#     db = deps["db"]
#     current_user = deps["current_user"]
#     token = await api_token.delete_token(db, token_id=token_id, user_id=current_user.id)
#     if not token:
#         raise HTTPException(status_code=404, detail="API token not found")
#     return token
