#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Break The Fast — Quick Start Script
# Starts both backend and frontend in a single command.
# Usage: ./start-dev.sh
# ─────────────────────────────────────────────────────────

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}🍛 Break The Fast — Development Startup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ─── Check prerequisites ───────────────────────────────────
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java not found. Install JDK 17+: brew install openjdk@17${NC}"
    exit 1
fi
JAVA_VER=$(java -version 2>&1 | head -1 | awk -F '"' '{print $2}' | cut -d'.' -f1)
echo -e "  ${GREEN}✓${NC} Java: $(java -version 2>&1 | head -1)"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Install v18+: brew install node${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓${NC} Node: $(node -v)"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found.${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓${NC} npm:  $(npm -v)"
echo ""

# ─── Install frontend deps if needed ──────────────────────
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    (cd "$FRONTEND_DIR" && npm install)
    echo ""
fi

# ─── Ensure Maven wrapper is executable ───────────────────
chmod +x "$BACKEND_DIR/mvnw" 2>/dev/null || true

# ─── Start backend ────────────────────────────────────────
echo -e "${CYAN}Starting backend (Spring Boot) on port 8080...${NC}"
(cd "$BACKEND_DIR" && ./mvnw spring-boot:run -q) &
BACKEND_PID=$!

# Wait for backend to be ready
echo -n "  Waiting for backend"
for i in $(seq 1 60); do
    if curl -s http://localhost:8080/api/v1/menu/categories > /dev/null 2>&1; then
        echo ""
        echo -e "  ${GREEN}✓ Backend ready!${NC}"
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

# ─── Start frontend ───────────────────────────────────────
echo -e "${CYAN}Starting frontend (Vite) on port 5173...${NC}"
(cd "$FRONTEND_DIR" && npm run dev) &
FRONTEND_PID=$!

sleep 3
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Break The Fast is running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  🌐 App:         ${CYAN}http://localhost:5173${NC}"
echo -e "  🔑 Admin:       ${CYAN}http://localhost:5173/login?mode=admin${NC}"
echo -e "  🗄️  H2 Console:  ${CYAN}http://localhost:8080/h2-console${NC}"
echo -e "  📡 API Base:    ${CYAN}http://localhost:8080/api/v1${NC}"
echo ""
echo -e "  Admin credentials: admin@breakthefast.com / BreakTheFast@2026"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers.${NC}"
echo ""

# ─── Cleanup on exit ──────────────────────────────────────
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}Done. Goodbye! 🙏${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script alive
wait
