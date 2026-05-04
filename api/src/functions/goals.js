const { app } = require('@azure/functions');
const { upsertItem, queryItems, testVar } = require("../db");

app.http('goals', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        if (request.method === "GET" ) {
        try {
            const user_id = request.query.get('user_id');
        
            if (!user_id) {
              return { 
                status: 400, 
                jsonBody: {error: "Missing user_id"}
                };
            }
        
            const query = {
              query: "SELECT * FROM c WHERE c.user_id = @user_id",
              parameters: [{ name: "@user_id", value: user_id }]
            };
        
            const results = await queryItems("Goals", query);        
            return {
                status: 200,
                jsonBody: results
            };
          } catch (err) {
                            return { 
                status: 500, 
                jsonBody: { error: err.message } 
                };
          }
        }

        if (request.method === "POST" ) {
        try {
            const data = await request.json();
        
            if (
              !data.user_id ||
              !data.metric_type ||
              data.goal_value == null ||
              !data.start_date
            ) {
              return {
                status: 400,

                jsonBody:
                { error: "Missing required fields" }};
            }
        
            const goalValue = Number(data.goal_value);
        
            if (Number.isNaN(goalValue) || goalValue < 0) {
              return {
                status: 400,

                jsonBody:
                { error: "Goal value must be a positive number" }};
            }
        
            const goal = {
              id: data.id || `${data.user_id}_${data.metric_type}`,
              user_id: data.user_id,
              metric_type: data.metric_type, // "sleep", "exercise", or "nutrition"
              goal_value: goalValue,
              start_date: data.start_date,
              end_date: data.end_date || null,
              updated_at: new Date().toISOString()
            };
        
            const result = await upsertItem("Goals", goal);
        
            return {
                status: 200,
                jsonBody: result
            };
          } catch (err) {
                            return { 
                status: 500, 
                jsonBody: { error: err.message } 
                };
          }
        }
    }
});
