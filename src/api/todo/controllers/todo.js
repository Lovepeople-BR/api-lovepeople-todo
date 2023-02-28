'use strict';

/**
 * todo controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::todo.todo', ({strapi}) => ({
    async find(ctx) {
        const user = ctx.state.user
        if (!user) {
        return ctx.badRequest(null, [{messages: [{id: "No auth header found"}]}])
        }

        const data = await strapi.entityService.findMany("api::todo.todo", {
        populate: 'image',
        filters: {
            "user": {
                "id": user.id
            }
        },

        });
        if (!data) {
        return ctx.notFound();
        }

        const sanitizedEvents = await this.sanitizeOutput(data, ctx);

        return this.transformResponse(sanitizedEvents);
    },
    async create(ctx) {
      const {id} = ctx.state.user; //ctx.state.user contains the current authenticated user
      const response = await super.create(ctx);
      const updatedResponse = await strapi.entityService
        .update('api::todo.todo', response.data.id, {data: {user: id}})
      return updatedResponse;
    },
    
  }));
