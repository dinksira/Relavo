def calculate_score(data: dict) -> dict:
    """
    Input data contains:
      - days_since_contact: int
      - overdue_invoices: int (count)
      - total_invoices: int
      - touchpoint_count: int (last 30 days)
      - last_outcome: str (positive/neutral/negative/none)
      - response_trend: str (improving/stable/declining/unknown)
    """
    
    days_since_contact = data.get("days_since_contact", 999)
    overdue_invoices = data.get("overdue_invoices", 0)
    total_invoices = data.get("total_invoices", 0)
    touchpoint_count = data.get("touchpoint_count", 0)
    last_outcome = data.get("last_outcome", "none")
    # response_trend = data.get("response_trend", "unknown")

    # CONTACT SCORE (30% weight)
    if days_since_contact == 0:
        contact_score = 100
    elif 1 <= days_since_contact <= 3:
        contact_score = 90
    elif 4 <= days_since_contact <= 7:
        contact_score = 75
    elif 8 <= days_since_contact <= 14:
        contact_score = 50
    elif 15 <= days_since_contact <= 30:
        contact_score = 25
    else:
        contact_score = 0

    # INVOICE SCORE (25% weight)
    if total_invoices == 0:
        invoice_score = 80
    elif overdue_invoices == 0:
        invoice_score = 100
    elif overdue_invoices == 1:
        invoice_score = 50
    else:
        invoice_score = 0

    # ACTIVITY SCORE (25% weight)
    if touchpoint_count >= 5:
        activity_score = 100
    elif 3 <= touchpoint_count <= 4:
        activity_score = 80
    elif 1 <= touchpoint_count <= 2:
        activity_score = 50
    else:
        activity_score = 20

    # OUTCOME SCORE (20% weight)
    if last_outcome == "positive":
        outcome_score = 100
    elif last_outcome == "neutral":
        outcome_score = 70
    elif last_outcome == "negative":
        outcome_score = 30
    else: # none
        outcome_score = 60

    final_score = round(
        (contact_score * 0.30) +
        (invoice_score * 0.25) +
        (activity_score * 0.25) +
        (outcome_score * 0.20)
    )

    if final_score >= 70:
        risk_level = "healthy"
    elif final_score >= 40:
        risk_level = "needs_attention"
    else:
        risk_level = "at_risk"

    return {
        "score": final_score,
        "risk_level": risk_level,
        "factors": {
            "contact_score": contact_score,
            "invoice_score": invoice_score,
            "activity_score": activity_score,
            "outcome_score": outcome_score,
            "days_since_contact": days_since_contact,
            "overdue_invoices": overdue_invoices,
            "touchpoint_count": touchpoint_count
        }
    }
