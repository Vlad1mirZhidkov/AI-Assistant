import { setData } from './firebase';
import { getDatabase, ref, get, set, child } from "firebase/database";
const XLSX = require('xlsx');

const workbook = XLSX.readFile('products.xlsx');
const sheet_name_list = workbook.SheetNames;
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

const clearData = async (path) => {
    try {
        const database = getDatabase();
        await remove(ref(database, path));
    } catch (e) {
        console.error("Error removing data:", e);
        throw e;
    }
};

(async () => {
    try {
        await clearData('/products');
        console.log('Data cleared successfully');
    } catch (error) {
        console.error('Error clearing data:', error);
    } finally{
        process.exit(0);
    }
})();

for(let productId = 0; productId < data.length; productId++) {
    if(data[productId].Name !== undefined || data[productId].Information !== undefined || data[productId].Price !== undefined) {
        setData(`/products/${productId}`, {
            name: data[productId].Name,
            info: data[productId].Information,
            price: data[productId].Price,
        });
    }
    else{
        console.log("Error: Undefined data");
    }
}

