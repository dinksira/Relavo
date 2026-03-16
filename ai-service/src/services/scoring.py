def calculate_health_score(data: dict) -> dict:
    """
    Calculates a client health score (0-100) based on four weighted factors:
    - Last Contact (30%): Frequency of interaction.
    - Invoice Status (25%): Payment reliability.
    - Response Trend (25%): Speed of message replies.
    - Activity Level (20%): Project/Task engagement.
    """
    
    # 1. Last Contact Score (30%)
    # Full points if contacted within 7 days, decays after that.
    days_since_contact = data.get('days_since_contact', 0)
    if days_since_contact <= 7:
        contact_score = 100
    elif days_since_contact <= 14:
        contact_score = 80
    elif days_since_contact <= 30:
        contact_score = 40
    else:
        contact_score = 0
        
    # 2. Invoice Score (25%)
    # Deductions for overdue invoices.
    overdue_count = data.get('overdue_invoices_count', 0)
    if overdue_count == 0:
        invoice_score = 100
    elif overdue_count == 1:
        invoice_score = 60
    else:
        invoice_score = 20
        
    # 3. Response Trend (25%)
    # Measures if they are getting slower (negative) or faster (positive).
    # expected value between -1.0 (slower) and 1.0 (faster)
    trend = data.get('response_time_trend', 0)
    response_score = 50 + (trend * 50) # Normalized to 0-100
    
    # 4. Activity Level (20%)
    # Relative to their historical average activity.
    activity_ratio = data.get('activity_ratio', 1.0) # 1.0 = average
    activity_score = min(100, activity_ratio * 100)

    # Weighted Calculation
    final_score = (
        (contact_score * 0.30) +
        (invoice_score * 0.25) +
        (response_score * 0.25) +
        (activity_score * 0.20)
    )
    
    # Determine Risk Level
    risk_level = "healthy"
    if final_score < 40:
        risk_level = "at_risk"
    elif final_score < 70:
        risk_level = "needs_attention"
        
    return {
        "score": int(final_score),
        "risk_level": risk_level,
        "breakdown": {
            "contact": contact_score,
            "invoices": invoice_score,
            "response": int(response_score),
            "activity": int(activity_score)
        }
    }
