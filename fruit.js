module.exports = function MultiFruitBasket(pool) {

    async function createFruitBasket(id, type, qty, price) {
        try {
            await pool.query(`insert into fruit_basket_item(multi_fruit_basket_id,fruit_type,qty,unit_price) values ($1,$2,$3,$4)`, [id, type, qty, price]);
        } catch (error) {
            console.log(error);
        }
    }

    async function getFruitBasketTable() {
        try {
            let x = await pool.query(`select * from fruit_basket_item`);
            return x.rows
        } catch (error) {
            console.log(error);
        }
    }

    async function getMultiFruitBasket() {
        try {
            let x = await pool.query(`select * from multi_fruit_basket`);
            return x.rows
        } catch (error) {
            console.log(error);
        }
    }

    async function addFruitToBasket(id, updateQtyFruit) {
        try {
            await pool.query(`update fruit_basket_item set qty = qty + $2 where multi_fruit_basket_id = $1 `, [id, updateQtyFruit])
        } catch (error) {
            console.log(error);
        }
    }

    async function removeFruitFromBasket(id, updateQtyFruit) {
        try {
            await pool.query(`update fruit_basket_item set qty = qty - $2 where multi_fruit_basket_id = $1 `, [id, updateQtyFruit])
            await pool.query(`delete from fruit_basket_item where qty=0 `)
        } catch (error) {
            console.log(error);
        }
    }

    async function getBasketName(id) {
        try {

            let x = await pool.query('select multi_fruit_basket.id, multi_fruit_basket.name,fruit_basket_item.fruit_type FROM fruit_basket_item INNER JOIN multi_fruit_basket ON fruit_basket_item.multi_fruit_basket_id = multi_fruit_basket.id where id=$1', [id])
            return x.rows;
        } catch (error) {
            console.log(error);
        }
    }

    async function getTotalCostBasedOnBasketName(name) {
        try {
            let x = await pool.query('select multi_fruit_basket.id, multi_fruit_basket.name,fruit_basket_item.fruit_type,fruit_basket_item.unit_price FROM fruit_basket_item INNER JOIN multi_fruit_basket ON fruit_basket_item.multi_fruit_basket_id = multi_fruit_basket.id where name=$1', [name])
            return x.rows[0].unit_price
        } catch (error) {
            console.log(error);
        }
    }

    async function getTotalCostBasedOnBasketId(id) {
        try {
            let y = await pool.query(`select unit_price from fruit_basket_item where multi_fruit_basket_id=$1`, [id]);
            return y.rows[0].unit_price
        } catch (error) {
            console.log(error);
        }
    }

    return {
        createFruitBasket,
        getFruitBasketTable,
        getMultiFruitBasket,
        removeFruitFromBasket,
        getBasketName,
        getTotalCostBasedOnBasketName,
        getTotalCostBasedOnBasketId,
        addFruitToBasket
    }
}