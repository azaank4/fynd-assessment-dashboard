from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

# Request/Response Models
class SubmissionRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="User rating from 1 to 5")
    review: str = Field(..., min_length=1, max_length=5000, description="User review text")

class SubmissionResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: str = Field(..., alias="_id")
    rating: int
    review: str
    ai_response: str
    ai_summary: str
    recommended_actions: str
    timestamp: datetime
    status: str

class AdminSubmissionResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: str = Field(..., alias="_id")
    rating: int
    review: str
    ai_summary: str
    recommended_actions: str
    timestamp: datetime
    status: str

class SubmissionListResponse(BaseModel):
    total: int
    submissions: list[AdminSubmissionResponse]

class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None
