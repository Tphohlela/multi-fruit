let assert = require("assert");
let fruitBasket = require("../fruit");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/multifruit_tests';

const pool = new Pool({
    connectionString
});

describe('The multi fruit basket function', function () {

    beforeEach(async function () {
        await pool.query("delete from fruit_basket_item");
        await pool.query("delete from multi_fruit_basket");
        await pool.query("INSERT INTO multi_fruit_basket (id,name) VALUES (1,'Golden delicious')");
        await pool.query("INSERT INTO multi_fruit_basket (id,name) VALUES (2,'Granny smith')");
        await pool.query("INSERT INTO multi_fruit_basket (id,name) VALUES (3,'Cling Peach')");
        await pool.query("INSERT INTO multi_fruit_basket (id,name) VALUES (4,'Nectarine')");
    });

    it('create a new fruit basket for a given fruit type, qty & fruit price', async function () {
        const fruit = fruitBasket(pool);

        const baskets = await fruit.getMultiFruitBasket();

         await fruit.createFruitBasket(baskets[1].id, 'apple', 1, 11.99);
         
        assert.deepStrictEqual([
            {
                "multi_fruit_basket_id": 2,
                "fruit_type": "apple",
                "qty": 1,
                "unit_price": "11.99"
            }
        ], await fruit.getFruitBasketTable());
    });

    it('add fruits to an existing basket', async function () {
        const fruit = fruitBasket(pool);

        const baskets = await fruit.getMultiFruitBasket();

        await fruit.createFruitBasket(baskets[1].id, 'apple', 1, 11.99);
        await fruit.createFruitBasket(baskets[2].id, 'peach', 2, 14.99);

        await fruit.addFruitToBasket(baskets[2].id,3)

        assert.deepStrictEqual([
            {
                "multi_fruit_basket_id": 2,
                "fruit_type": "apple",
                "qty": 1,
                "unit_price": "11.99"
            },
            {
                "multi_fruit_basket_id": 3,
                "fruit_type": "peach",
                "qty": 5,
                "unit_price": "14.99"
            }
        ], await fruit.getFruitBasketTable());
    });

    it('remove fruits from an existing basket - if there are no fruit left in the basket the basket should be removed,', async function () {
        const fruit = fruitBasket(pool);

        const baskets = await fruit.getMultiFruitBasket();

        await fruit.createFruitBasket(baskets[1].id, 'apple', 1, 11.99);
        await fruit.createFruitBasket(baskets[2].id, 'peach', 2, 14.99);

        await fruit.removeFruitFromBasket(baskets[2].id, 1)

        assert.deepStrictEqual([
            {
                "multi_fruit_basket_id": 2,
                "fruit_type": "apple",
                "qty": 1,
                "unit_price": "11.99"
            },
            {
                "multi_fruit_basket_id": 3,
                "fruit_type": "peach",
                "qty": 1,
                "unit_price": "14.99"
            }
        ], await fruit.getFruitBasketTable());

        await fruit.removeFruitFromBasket(baskets[2].id, 1)
        assert.deepStrictEqual([
            {
                "multi_fruit_basket_id": 2,
                "fruit_type": "apple",
                "qty": 1,
                "unit_price": "11.99"
            }
        ], await fruit.getFruitBasketTable());
    });


    it('for a given id return the basket_name & id as well as all the fruits in the basket', async function () {
        const fruit = fruitBasket(pool);

        const baskets = await fruit.getMultiFruitBasket();

        await fruit.createFruitBasket(baskets[1].id, 'apple', 1, 11.99);
        await fruit.createFruitBasket(baskets[2].id, 'peach', 2, 14.99);
       
       const result = await fruit.getBasketName(baskets[1].id)

        assert.deepStrictEqual([
            {
                "id": 2,
                "name":'Granny smith',
                "fruit_type": "apple",
            }
        ], result);
    });

    it('return the total cost of a specific basket based on basket name', async function () {
        const fruit = fruitBasket(pool);

        const baskets = await fruit.getMultiFruitBasket();

        await fruit.createFruitBasket(baskets[1].id, 'apple', 1, 11.99);
        await fruit.createFruitBasket(baskets[2].id, 'peach', 2, 14.99);
       
       const result = await fruit.getTotalCostBasedOnBasketName('Granny smith')

        assert.equal(11.99, result);
    });


    it('return the total cost of a specific basket based on basket id', async function () {
        const fruit = fruitBasket(pool);

        const baskets = await fruit.getMultiFruitBasket();

        await fruit.createFruitBasket(baskets[1].id, 'apple', 1, 11.99);
        await fruit.createFruitBasket(baskets[2].id, 'peach', 2, 14.99);
       
       const result = await fruit.getTotalCostBasedOnBasketId(baskets[2].id)

        assert.equal(14.99, result);
    });

    after(function () {
        pool.end();
    })
});