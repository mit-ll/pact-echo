/* 
 *  DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.
 *  
 *  This material is based upon work supported by the United States Air Force under
 *   Air Force Contract No. FA8702-15-D-0001. Any opinions, findings, conclusions 
 *   or recommendations expressed in this material are those of the author(s) and 
 *   do not necessarily reflect the views of the United States Air Force.
 *  
 *  (c) 2020 Massachusetts Institute of Technology.
 *  
 *  The software/firmware is provided to you on an As-Is basis
 *  
 *  Delivered to the U.S. Government with Unlimited Rights, as defined in 
 *  DFARS Part 252.227-7013 or 7014 (Feb 2014). Notwithstanding any copyright
 *  notice, U.S. Government rights in this work are defined by DFARS 252.227-7013 
 *  or DFARS 252.227-7014 as detailed above. Use of this work other than as 
 *  specifically authorized by the U.S. Government may violate any copyrights 
 *  that exist in this work.
 */

"use strict";

process.env.TEST=true;

const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const DbMixin = require("../../../mixins/db.mixin");

describe("Test DB mixin", () => {

	describe("Test schema generator", () => {
		const broker = new ServiceBroker({ logger: false, cacher: "Memory" });

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		it("check schema properties", async () => {
			const schema = DbMixin("my-collection");

			expect(schema.mixins).toEqual([DbService]);
			expect(schema.adapter).toBeInstanceOf(DbService.MemoryAdapter);
			expect(schema.started).toBeDefined();
			expect(schema.events["cache.clean.my-collection"]).toBeInstanceOf(Function);
		});

		it("check cache event handler", async () => {
			jest.spyOn(broker.cacher, "clean");

			const schema = DbMixin("my-collection");

			await schema.events["cache.clean.my-collection"].call({ broker, fullName: "my-service" });

			expect(broker.cacher.clean).toBeCalledTimes(1);
			expect(broker.cacher.clean).toBeCalledWith("my-service.*");
		});

		describe("Check service started handler", () => {

			it("should not call seedDB method", async () => {
				const schema = DbMixin("my-collection");

				schema.adapter.count = jest.fn(async () => 10);
				const seedDBFn = jest.fn();

				await schema.started.call({ broker, logger: broker.logger, adapter: schema.adapter, seedDB: seedDBFn });

				expect(schema.adapter.count).toBeCalledTimes(1);
				expect(schema.adapter.count).toBeCalledWith();

				expect(seedDBFn).toBeCalledTimes(0);
			});

			it("should call seedDB method", async () => {
				const schema = DbMixin("my-collection");

				schema.adapter.count = jest.fn(async () => 0);
				const seedDBFn = jest.fn();

				await schema.started.call({ broker, logger: broker.logger, adapter: schema.adapter, seedDB: seedDBFn });

				expect(schema.adapter.count).toBeCalledTimes(2);
				expect(schema.adapter.count).toBeCalledWith();

				expect(seedDBFn).toBeCalledTimes(1);
				expect(seedDBFn).toBeCalledWith();
			});
		});

		it("should broadcast a cache clear event", async () => {
			const schema = DbMixin("my-collection");

			const ctx = {
				broadcast: jest.fn()
			};

			await schema.methods.entityChanged(null, null, ctx);

			expect(ctx.broadcast).toBeCalledTimes(1);
			expect(ctx.broadcast).toBeCalledWith("cache.clean.my-collection");
		});
	});

});

