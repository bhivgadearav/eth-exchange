"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./router"));
const db_1 = __importDefault(require("./config/db"));
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', router_1.default);
const PORT = parseInt(process.env.PORT || '3000') || 3000;
// Connect to MongoDB
(0, db_1.default)();
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
