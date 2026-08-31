
def categorize_ticket(subject: str, message: str):
    """
    Mock AI/LLM ticket classifier.

    In a real application, this function could call an LLM API.
    For this assignment, a mocked classifier is acceptable.
    """

    text = f"{subject} {message}".lower()

    # Category classification
    if any(word in text for word in [
        "payment",
        "billing",
        "invoice",
        "charge",
        "refund",
        "subscription",
    ]):
        category = "billing"

    elif any(word in text for word in [
        "login",
        "password",
        "account",
        "sign in",
        "signup",
    ]):
        category = "account"

    elif any(word in text for word in [
        "error",
        "bug",
        "crash",
        "not working",
        "broken",
        "failed",
    ]):
        category = "technical"

    elif any(word in text for word in [
        "feature",
        "request",
        "suggestion",
    ]):
        category = "feature_request"

    else:
        category = "general"

    # Urgency classification
    if any(word in text for word in [
        "urgent",
        "critical",
        "emergency",
        "down",
        "blocked",
        "cannot access",
    ]):
        urgency = "high"

    elif any(word in text for word in [
        "soon",
        "important",
        "issue",
        "problem",
    ]):
        urgency = "medium"

    else:
        urgency = "low"

    return {
        "category": category,
        "urgency": urgency,
    }
