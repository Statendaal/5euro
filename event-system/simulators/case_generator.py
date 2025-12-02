"""
Realistic case generator based on CBS data.
"""
import random
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List
import sys
sys.path.append('..')

from shared.events import (
    CaseIntakeEvent, CaseIntakeData,
    CaseAnalysisEvent, CaseAnalysisData,
    CaseDecisionEvent, CaseDecisionData,
    CaseCompletedEvent, CaseCompletedData,
    PaymentPlanCreatedEvent, PaymentPlanData,
    DebtForgivenEvent, DebtForgivenData
)

logger = logging.getLogger(__name__)


class CaseGenerator:
    """
    Generate realistic case scenarios based on CBS statistics.
    """

    # Debt types with probabilities from CBS data
    DEBT_TYPES = {
        "cak_eigen_bijdrage": 0.15,
        "zorgverzekering": 0.26,
        "parkeerboete": 0.12,
        "verkeersboete": 0.17,
        "studiefinanciering": 0.08,
        "gemeentebelasting": 0.10,
        "afvalstoffenheffing": 0.06,
        "hondenbelasting": 0.03,
        "toeslagen": 0.03
    }

    # Organizations
    ORGANIZATIONS = {
        "cak_eigen_bijdrage": "CAK",
        "zorgverzekering": ["Zilveren Kruis", "VGZ", "CZ", "Menzis"],
        "parkeerboete": "Gemeente",
        "verkeersboete": "CJIB",
        "studiefinanciering": "DUO",
        "gemeentebelasting": "Gemeente",
        "afvalstoffenheffing": "Gemeente",
        "hondenbelasting": "Gemeente",
        "toeslagen": "Belastingdienst"
    }

    # Debt amount distributions (based on real patterns)
    DEBT_AMOUNT_RANGES = {
        "cak_eigen_bijdrage": (5, 150),
        "zorgverzekering": (50, 2000),
        "parkeerboete": (65, 95),
        "verkeersboete": (95, 380),
        "studiefinanciering": (50, 5000),
        "gemeentebelasting": (100, 800),
        "afvalstoffenheffing": (50, 400),
        "hondenbelasting": (85, 150),
        "toeslagen": (500, 10000)
    }

    # Income sources and levels
    INCOME_SOURCES = {
        "employment": {"prob": 0.50, "min": 1800, "max": 5000},
        "benefit_social": {"prob": 0.20, "min": 1100, "max": 1400},
        "benefit_unemployment": {"prob": 0.10, "min": 1200, "max": 2500},
        "pension": {"prob": 0.15, "min": 1300, "max": 2200},
        "other": {"prob": 0.05, "min": 800, "max": 1500}
    }

    def __init__(self, seed: int = 42):
        random.seed(seed)

    def generate_bsn(self) -> str:
        """Generate random (fake) BSN."""
        return ''.join([str(random.randint(0, 9)) for _ in range(9)])

    def generate_case_intake(self, case_id: str = None) -> CaseIntakeEvent:
        """Generate realistic case intake event."""
        if not case_id:
            case_id = f"case-{random.randint(100000, 999999)}"

        # Select debt type weighted by probability
        debt_type = random.choices(
            list(self.DEBT_TYPES.keys()),
            weights=list(self.DEBT_TYPES.values())
        )[0]

        # Get organization
        org = self.ORGANIZATIONS[debt_type]
        if isinstance(org, list):
            org = random.choice(org)

        # Generate debt amount
        min_amt, max_amt = self.DEBT_AMOUNT_RANGES[debt_type]
        debt_amount = round(random.uniform(min_amt, max_amt), 2)

        # Intake channel probabilities
        channel = random.choices(
            ["online", "phone", "walk_in", "email"],
            weights=[0.50, 0.30, 0.15, 0.05]
        )[0]

        # Priority (most cases are normal)
        priority = random.choices(
            ["low", "normal", "high", "urgent"],
            weights=[0.10, 0.70, 0.15, 0.05]
        )[0]

        data = CaseIntakeData(
            case_id=case_id,
            citizen_bsn=self.generate_bsn(),
            debt_amount=debt_amount,
            debt_type=debt_type,
            organization=org,
            intake_channel=channel,
            priority=priority,
            contact_info={
                "email": f"burger{random.randint(1000, 9999)}@example.nl",
                "phone": f"06{random.randint(10000000, 99999999)}"
            }
        )

        return CaseIntakeEvent(data=data, correlation_id=case_id)

    def generate_citizen_profile(self, debt_amount: float) -> Dict[str, Any]:
        """Generate realistic citizen profile."""
        # Select income source
        income_source = random.choices(
            list(self.INCOME_SOURCES.keys()),
            weights=[s["prob"] for s in self.INCOME_SOURCES.values()]
        )[0]

        income_config = self.INCOME_SOURCES[income_source]
        monthly_income = round(
            random.uniform(income_config["min"], income_config["max"]), 2
        )

        # Demographics
        age = random.randint(18, 75)
        has_children = random.random() < 0.35
        num_children = random.randint(1, 3) if has_children else 0

        # Risk factors
        has_social_benefits = income_source in ["benefit_social", "benefit_unemployment"]
        is_unemployed = income_source == "benefit_unemployment"

        return {
            "monthly_income": monthly_income,
            "income_source": income_source,
            "age": age,
            "has_children": has_children,
            "number_of_children": num_children,
            "has_social_benefits": has_social_benefits,
            "is_unemployed": is_unemployed,
            "debt_to_income_ratio": round(debt_amount / monthly_income, 3)
        }

    def generate_case_analysis(
        self,
        case_id: str,
        debt_amount: float
    ) -> CaseAnalysisEvent:
        """Generate case analysis based on citizen profile."""
        profile = self.generate_citizen_profile(debt_amount)

        # Calculate risk score (0-100)
        risk_score = 0

        # Income risk
        if profile["monthly_income"] < 1200:
            risk_score += 35
        elif profile["monthly_income"] < 1800:
            risk_score += 20

        # Debt burden
        if profile["debt_to_income_ratio"] > 0.5:
            risk_score += 30
        elif profile["debt_to_income_ratio"] > 0.2:
            risk_score += 15

        # Social factors
        if profile["is_unemployed"]:
            risk_score += 20
        elif profile["has_social_benefits"]:
            risk_score += 10

        # Children
        if profile["has_children"]:
            risk_score += 10

        risk_score = min(100, risk_score)

        # Calculate success probability (inverse of risk)
        success_probability = max(0.1, 1 - (risk_score / 100))

        # Determine recommendation
        if risk_score > 70 or profile["debt_to_income_ratio"] > 1.0:
            recommended_action = "refer_to_assistance"
        elif debt_amount < 100 and risk_score > 50:
            recommended_action = "forgive"
        elif risk_score > 40:
            recommended_action = "payment_plan"
        else:
            recommended_action = "collect_standard"

        # Calculate estimated savings
        base_savings = debt_amount * 13.06  # CBS maatschappelijke kosten multiplier
        direct_savings = debt_amount * 0.5 if recommended_action == "forgive" else 0
        societal_savings = base_savings if risk_score > 60 else base_savings * 0.3

        data = CaseAnalysisData(
            case_id=case_id,
            citizen_profile=profile,
            risk_score=risk_score,
            success_probability=round(success_probability, 2),
            recommended_action=recommended_action,
            estimated_direct_savings=round(direct_savings, 2),
            estimated_societal_savings=round(societal_savings, 2),
            estimated_total_savings=round(direct_savings + societal_savings, 2),
            analysis_confidence=round(random.uniform(0.75, 0.95), 2),
            reasoning=[
                f"Risk score: {risk_score}/100",
                f"Debt-to-income ratio: {profile['debt_to_income_ratio']:.1%}",
                f"Income: €{profile['monthly_income']}/month"
            ]
        )

        return CaseAnalysisEvent(
            data=data,
            correlation_id=case_id
        )

    def generate_case_decision(
        self,
        case_id: str,
        recommended_action: str,
        override_probability: float = 0.15
    ) -> CaseDecisionEvent:
        """Generate case decision event."""
        # Sometimes caseworker overrides ML recommendation
        overridden = random.random() < override_probability

        if overridden:
            # Caseworker might be more lenient
            possible_actions = ["forgive", "payment_plan", "refer_to_assistance"]
            decision = random.choice(possible_actions)
            decided_by = f"caseworker-{random.randint(100, 999)}"
            reason = "Caseworker override based on additional context"
        else:
            decision = recommended_action
            decided_by = "system"
            reason = "Following ML recommendation"

        data = CaseDecisionData(
            case_id=case_id,
            decision=decision,
            decided_by=decided_by,
            decision_reason=reason,
            overridden=overridden,
            original_recommendation=recommended_action if overridden else None,
            next_steps=[
                "Send notification to citizen",
                "Update case status"
            ]
        )

        return CaseDecisionEvent(
            data=data,
            correlation_id=case_id
        )

    def generate_payment_plan(
        self,
        case_id: str,
        debt_amount: float,
        monthly_income: float
    ) -> PaymentPlanCreatedEvent:
        """Generate payment plan event."""
        # Calculate affordable monthly payment (max 5-10% of income)
        max_monthly = monthly_income * random.uniform(0.05, 0.10)
        monthly_amount = min(max_monthly, debt_amount / 6)  # Min 6 months
        monthly_amount = max(10, round(monthly_amount, 2))  # Min €10

        duration_months = int(debt_amount / monthly_amount) + 1
        duration_months = min(120, duration_months)  # Max 10 years

        start_date = datetime.utcnow() + timedelta(days=7)

        data = PaymentPlanData(
            case_id=case_id,
            monthly_amount=monthly_amount,
            duration_months=duration_months,
            start_date=start_date,
            first_payment_date=start_date + timedelta(days=30),
            interest_rate=0.0  # No interest for social debt
        )

        return PaymentPlanCreatedEvent(
            data=data,
            correlation_id=case_id
        )

    def generate_debt_forgiven(
        self,
        case_id: str,
        debt_amount: float
    ) -> DebtForgivenEvent:
        """Generate debt forgiven event."""
        # Usually forgive full amount for small debts
        forgiven_amount = debt_amount if debt_amount < 100 else debt_amount * random.uniform(0.5, 1.0)
        forgiven_amount = round(forgiven_amount, 2)

        data = DebtForgivenData(
            case_id=case_id,
            original_amount=debt_amount,
            forgiven_amount=forgiven_amount,
            reason="Cost-benefit analysis: collection costs exceed debt value",
            approved_by="system"
        )

        return DebtForgivenEvent(
            data=data,
            correlation_id=case_id
        )

    def generate_case_completed(
        self,
        case_id: str,
        decision: str,
        debt_amount: float,
        estimated_savings: float
    ) -> CaseCompletedEvent:
        """Generate case completed event."""
        # Outcome based on decision
        outcome_map = {
            "forgive": "resolved",
            "payment_plan": "resolved",
            "collect_standard": "resolved",
            "refer_to_assistance": "escalated"
        }

        outcome = outcome_map.get(decision, "resolved")

        # Duration: 15 min to 2 hours
        duration_seconds = random.randint(900, 7200)

        # Costs (simplified)
        total_cost = random.uniform(50, 200)

        data = CaseCompletedData(
            case_id=case_id,
            outcome=outcome,
            resolution_method=decision,
            duration_seconds=duration_seconds,
            total_cost=round(total_cost, 2),
            total_savings=round(estimated_savings, 2),
            citizen_satisfaction=random.randint(3, 5) if outcome == "resolved" else None
        )

        return CaseCompletedEvent(
            data=data,
            correlation_id=case_id
        )

    def generate_full_case_flow(self, case_id: str = None) -> List[Any]:
        """Generate complete case flow from intake to completion."""
        if not case_id:
            case_id = f"case-{random.randint(100000, 999999)}"

        events = []

        # 1. Intake
        intake_event = self.generate_case_intake(case_id)
        events.append(intake_event)

        # 2. Analysis
        analysis_event = self.generate_case_analysis(
            case_id,
            intake_event.data.debt_amount
        )
        events.append(analysis_event)

        # 3. Decision
        decision_event = self.generate_case_decision(
            case_id,
            analysis_event.data.recommended_action
        )
        events.append(decision_event)

        # 4. Action-specific events
        if decision_event.data.decision == "payment_plan":
            plan_event = self.generate_payment_plan(
                case_id,
                intake_event.data.debt_amount,
                analysis_event.data.citizen_profile["monthly_income"]
            )
            events.append(plan_event)
        elif decision_event.data.decision == "forgive":
            forgive_event = self.generate_debt_forgiven(
                case_id,
                intake_event.data.debt_amount
            )
            events.append(forgive_event)

        # 5. Completion
        completed_event = self.generate_case_completed(
            case_id,
            decision_event.data.decision,
            intake_event.data.debt_amount,
            analysis_event.data.estimated_total_savings
        )
        events.append(completed_event)

        return events


if __name__ == "__main__":
    # Demo
    logging.basicConfig(level=logging.INFO)

    generator = CaseGenerator()

    print("Generating 5 full case flows...\n")

    for i in range(5):
        case_id = f"demo-case-{i+1}"
        events = generator.generate_full_case_flow(case_id)

        print(f"=== Case {case_id} ===")
        for event in events:
            print(f"  {event.event_type}: {event.data.model_dump()}")
        print()
