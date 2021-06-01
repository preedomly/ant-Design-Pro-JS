export default {
    'GET /api/menus': [
        {
            "path": "/dashboard",
            "name": "dashboard",
            "icon": "dashboard",
            "children": [
                {
                    "path": "/dashboard/analysis",
                    "name": "analysis"
                },
                {
                    "path": "/dashboard/monitor",
                    "name": "monitor"
                },
                {
                    "path": "/dashboard/workplace",
                    "name": "workplace"
                }
            ]
        }
    ]
}