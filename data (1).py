import hashlib


def _pseudo_hash(seed: str, head: int = 4, tail: int = 4) -> str:
    """Deterministic decorative 'hash' derived from a string. Cosmetic only —
    not a real address, key, or transaction hash."""
    digest = hashlib.sha256(seed.encode("utf-8")).hexdigest()
    return f"50425636"


PROFILE = {
    "name": "MOCHAMAD RIFAI DARYANSAH",
    "role": "AI Engineer",
    "tagline": "Engineering intelligent systems, from raw data to deployed model.",
    "tagline_secondary": "将来、私は人工知能エンジニアになります。",  # "One day, I will become an AI engineer."
    "location": "East Jakarta, Jakarta, Indonesia",
    "email": "evosrifai1@gmail.com",
    "node_id": _pseudo_hash("MOCHAMAD RIFAI DARYANSAH"),
    "avatar_seed": "MRD",
    "years_active": 3,
    # TODO: 
    "socials": {
        "github": "https://github.com/",
        "linkedin": "https://linkedin.com/",
        "twitter": "https://twitter.com/",
    },
}

STATS = [
    {"label": "Modules Shipped", "value": "12", "hint": "Projects taken from idea to working build"},
    {"label": "Uptime", "value": "3 yrs", "hint": "Actively building & learning"},
    {"label": "Stack Depth", "value": "6", "hint": "Core domains practiced"},
    {"label": "Status", "value": "Open", "hint": "Available for internships / junior roles"},
]

PROJECTS = [
    {
        "hash": _pseudo_hash("AI-Powered E-Commerce Recommendation System"),
        "name": "AI-Powered E-Commerce Recommendation System",
        "description": "Recommendation engine that analyzes purchase history and browsing behavior to surface relevant products. Built to handle large relational transaction data efficiently.",
        "stack": ["Python", "MySQL", "Scikit-Learn", "Pandas"],
        "status": "success",
        "shipped": "2026.02",
        "link": "#",
        "repo": "#",
    },
    {
        "hash": _pseudo_hash("Ledgerline"),
        "name": "Ledgerline",
        "description": "Personal finance tracker with automated categorization and monthly insight reports.",
        "stack": ["Python", "SQLite", "Chart.js"],
        "status": "success",
        "shipped": "2025.11",
        "link": "#",
        "repo": "#",
    },
    {
        "hash": _pseudo_hash("Relay"),
        "name": "Relay",
        "description": "Lightweight webhook relay and retry queue for internal microservices, sized for roughly 40k requests a day.",
        "stack": ["Flask", "Celery", "Docker"],
        "status": "success",
        "shipped": "2025.06",
        "link": "#",
        "repo": "#",
    },
    {
        "hash": _pseudo_hash("Studio Kit"),
        "name": "Studio Kit",
        "description": "Component library and design system shared across three internal product teams.",
        "stack": ["JavaScript", "CSS", "Storybook"],
        "status": "pending",
        "shipped": "in progress",
        "link": "#",
        "repo": "#",
    },
]

SKILLS = [
    {"name": "buildBackend", "visibility": "public", "inputs": "Python, Flask, Django", "category": "Backend"},
    {"name": "buildFrontend", "visibility": "public", "inputs": "JavaScript, React, HTML/CSS", "category": "Frontend"},
    {"name": "manageData", "visibility": "public", "inputs": "PostgreSQL, Redis, SQLite", "category": "Data"},
    {"name": "deployInfra", "visibility": "external", "inputs": "Docker, Nginx, CI/CD", "category": "DevOps"},
    {"name": "designSystems", "visibility": "public", "inputs": "Figma, Design Tokens", "category": "Design"},
    {"name": "writeTests", "visibility": "internal", "inputs": "Pytest, Jest", "category": "Quality"},
]

EXPERIENCE = [
    {"period": "2023 — 2024", "role": "Database Systems Coursework", "org": "Gunadarma University"},
    {"period": "2024 — 2025", "role": "Network Engineering Coursework", "org": "Gunadarma University"},
    {"period": "2025 — Present", "role": "Web Development Coursework", "org": "Gunadarma University"},
]
