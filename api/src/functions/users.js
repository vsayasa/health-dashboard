const { app } = require('@azure/functions');
const { upsertItem, queryItems } = require("../db");
// /api/users
app.http('users', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        // GET user.
        if (request.method === "GET") {
        try {
            let query;
            if (request.query.size > 0) {
              query = {
                query: "SELECT * FROM c WHERE c.id = @id",
                parameters: [{ name: "@id", value: request.query.get('user_id') }]
              };
            } else {
              query = {
                query: "SELECT * FROM c"
              };
            }
            const results = await queryItems("Users", query);
            return { 
                status: 200, 
                jsonBody: results 
                };

            } 
            catch (err) {
                return { 
                status: 500, 
                jsonBody: { error: err.message } 
                };
            
              }
        }

        // POST /api/users, create new user
        if (request.method === "POST") {
            try {
                const body = await request.json();
                const { id, email, created_at, startDate, endDate } = body;
            
                const user = {
                  id, // partition key
                  email,
                  created_at,
                  startDate,
                  endDate
            
                };
            
                const results = await upsertItem("Users", user);
                return { 
                    status: 200, 
                    jsonBody: results 
                };
              } 
              catch (err) {
                return { 
                status: 500, 
                jsonBody: { error: err.message } 
                };
            
              }
        }
        
    }
});
