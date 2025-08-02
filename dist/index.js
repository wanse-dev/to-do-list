"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const index_1 = __importDefault(require("./routes/index"));
const database_1 = __importDefault(require("./database"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({ origin: 'https://work-tasks-management.netlify.app' }));
app.use(express_1.default.json());
(0, database_1.default)();
app.get("/", (req, res) => {
    res.send("Server working properly!");
});
app.use("/api", index_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map