"""
Event models using Pydantic for validation and serialization.
"""
from datetime import datetime
from typing import Any, Dict, List, Optional, Literal
from pydantic import BaseModel, Field, field_validator
import uuid


class BaseEvent(BaseModel):
    """Base class for all events."""
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    correlation_id: Optional[str] = None
    causation_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# ============================================================================
# Case Intake Events
# ============================================================================

class CaseIntakeData(BaseModel):
    """Data for case intake event."""
    case_id: str
    citizen_bsn: str = Field(min_length=9, max_length=9)
    debt_amount: float = Field(gt=0)
    debt_type: Literal[
        "cak_eigen_bijdrage",
        "zorgverzekering",
        "parkeerboete",
        "verkeersboete",
        "studiefinanciering",
        "gemeentebelasting",
        "afvalstoffenheffing",
        "hondenbelasting",
        "toeslagen",
        "other"
    ]
    organization: str
    intake_channel: Literal["online", "phone", "walk_in", "email"]
    priority: Literal["low", "normal", "high", "urgent"] = "normal"
    contact_info: Optional[Dict[str, str]] = None
    notes: Optional[str] = None


class CaseIntakeEvent(BaseEvent):
    """Event: New case has been registered."""
    event_type: Literal["case.intake"] = "case.intake"
    data: CaseIntakeData


# ============================================================================
# Case Analysis Events
# ============================================================================

class CaseAnalysisData(BaseModel):
    """Data for case analysis event."""
    case_id: str
    citizen_profile: Dict[str, Any]
    risk_score: int = Field(ge=0, le=100)
    success_probability: float = Field(ge=0, le=1)
    recommended_action: Literal["forgive", "payment_plan", "collect_standard", "refer_to_assistance"]
    estimated_direct_savings: float
    estimated_societal_savings: float
    estimated_total_savings: float
    analysis_confidence: float = Field(ge=0, le=1)
    reasoning: List[str] = Field(default_factory=list)
    ml_model_version: str = "v1"


class CaseAnalysisEvent(BaseEvent):
    """Event: Case has been analyzed by ML model."""
    event_type: Literal["case.analysis"] = "case.analysis"
    data: CaseAnalysisData


# ============================================================================
# Case Decision Events
# ============================================================================

class CaseDecisionData(BaseModel):
    """Data for case decision event."""
    case_id: str
    decision: Literal["forgive", "payment_plan", "collect_standard", "refer_to_assistance", "escalate"]
    decided_by: str  # "system" or caseworker_id
    decision_reason: str
    overridden: bool = False  # True if caseworker overrode ML recommendation
    original_recommendation: Optional[str] = None
    next_steps: List[str] = Field(default_factory=list)
    assigned_to: Optional[str] = None


class CaseDecisionEvent(BaseEvent):
    """Event: Decision has been made on case."""
    event_type: Literal["case.decision"] = "case.decision"
    data: CaseDecisionData


# ============================================================================
# Case Action Events
# ============================================================================

class PaymentPlanData(BaseModel):
    """Data for payment plan created event."""
    case_id: str
    monthly_amount: float = Field(gt=0)
    duration_months: int = Field(ge=1, le=120)
    start_date: datetime
    first_payment_date: datetime
    interest_rate: float = Field(ge=0, le=1)


class PaymentPlanCreatedEvent(BaseEvent):
    """Event: Payment plan has been created."""
    event_type: Literal["case.payment_plan_created"] = "case.payment_plan_created"
    data: PaymentPlanData


class DebtForgivenData(BaseModel):
    """Data for debt forgiven event."""
    case_id: str
    original_amount: float
    forgiven_amount: float
    reason: str
    approved_by: str


class DebtForgivenEvent(BaseEvent):
    """Event: Debt has been forgiven."""
    event_type: Literal["case.debt_forgiven"] = "case.debt_forgiven"
    data: DebtForgivenData


# ============================================================================
# Case Completion Events
# ============================================================================

class CaseCompletedData(BaseModel):
    """Data for case completed event."""
    case_id: str
    outcome: Literal["resolved", "withdrawn", "escalated", "failed"]
    resolution_method: Optional[str] = None
    duration_seconds: int
    total_cost: float
    total_savings: float
    citizen_satisfaction: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None


class CaseCompletedEvent(BaseEvent):
    """Event: Case has been completed."""
    event_type: Literal["case.completed"] = "case.completed"
    data: CaseCompletedData


# ============================================================================
# System Events
# ============================================================================

class SystemHealthData(BaseModel):
    """Data for system health event."""
    component: str
    status: Literal["healthy", "degraded", "unhealthy"]
    metrics: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SystemHealthEvent(BaseEvent):
    """Event: System health status."""
    event_type: Literal["system.health"] = "system.health"
    data: SystemHealthData


# ============================================================================
# Error Events
# ============================================================================

class ErrorData(BaseModel):
    """Data for error event."""
    error_type: str
    error_message: str
    stack_trace: Optional[str] = None
    context: Dict[str, Any] = Field(default_factory=dict)
    severity: Literal["low", "medium", "high", "critical"] = "medium"


class ErrorEvent(BaseEvent):
    """Event: Error occurred."""
    event_type: Literal["system.error"] = "system.error"
    data: ErrorData


# ============================================================================
# Event Registry
# ============================================================================

EVENT_REGISTRY: Dict[str, type[BaseEvent]] = {
    "case.intake": CaseIntakeEvent,
    "case.analysis": CaseAnalysisEvent,
    "case.decision": CaseDecisionEvent,
    "case.payment_plan_created": PaymentPlanCreatedEvent,
    "case.debt_forgiven": DebtForgivenEvent,
    "case.completed": CaseCompletedEvent,
    "system.health": SystemHealthEvent,
    "system.error": ErrorEvent,
}


def deserialize_event(event_dict: Dict[str, Any]) -> BaseEvent:
    """Deserialize event from dictionary."""
    event_type = event_dict.get("event_type")
    event_class = EVENT_REGISTRY.get(event_type)

    if not event_class:
        raise ValueError(f"Unknown event type: {event_type}")

    return event_class(**event_dict)


def serialize_event(event: BaseEvent) -> Dict[str, Any]:
    """Serialize event to dictionary."""
    return event.model_dump(mode='json')
