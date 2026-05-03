const { app } = require('@azure/functions');
const { upsertItem, queryItems } = require("../db");

app.http('metrics', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        if (request.method === "GET" ) {
        try {
            const user_id = request.query.get('user_id');
            const start_date = request.query.get('start_date');
            const end_date = request.query.get('end_date');
            const days = request.query.get('days');
        
            let finalStartDate = start_date;
            let finalEndDate = end_date;
        
            if (!finalStartDate || !finalEndDate) {
              if (days) {
                const numDays = parseInt(days);
        
                if (!isNaN(numDays)) {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(end.getDate() - (numDays - 1));
        
                  // format YYYY-MM-DD (important for Cosmos string compare)
                  finalStartDate = start.toISOString().split("T")[0];
                  finalEndDate = end.toISOString().split("T")[0];
                }
              }
            }
        
            let query = "SELECT * FROM c WHERE c.user_id = @user_id";
        
            const params = [
              { name: "@user_id", value: user_id }
            ];
        
            if (finalStartDate && finalEndDate) {
              query += " AND c.date >= @start_date AND c.date <= @end_date";
        
              params.push(
                { name: "@start_date", value: finalStartDate },
                { name: "@end_date", value: finalEndDate }
              );
            }
        
            const results = await queryItems("Metrics", {
              query,
              parameters: params
            });
        
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
            const body = await request.json();
    
        
            const id = `${body.user_id}_${body.date}`;
        
            const document = {
              id,
              user_id: body.user_id,
              date: body.date,
        
              sleep: body.sleep || {},
              exercise: body.exercise || {},
              wellness: body.wellness || {},
              nutrition: body.nutrition || {}
            };
        
            const results = await upsertItem("Metrics", document);
        
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
    }
});
