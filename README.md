# Ludo Arena — Admin Test Build (v0.1)

A browser-based starter prototype for a Ludo game UI with local turns and a private admin testing control.

## Run it
1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Click **Admin Mode**.
4. Enable **Test Mode**, choose Red / Blue / Green / Yellow, then select **Finish test match with selected winner**.

## What works in this starter
- Responsive game page and four-colour board layout.
- Local turn flow, dice roll, basic token activation and movement prototype.
- Admin test panel to finish a local test round with a selected colour.
- New Game / reset.
- No match history is saved; no backend/database is connected.

## Important limitations
This is a first UI/gameplay prototype, not yet a complete rules-compliant Ludo implementation. The board route, home stretch, captures, safe cells, full win condition, and proper multi-player synchronization still need to be implemented. Admin controls are client-side and are **not secure**. Before online multiplayer, move game state and test overrides to a server, restrict test overrides to private test rooms, and enforce authorization server-side.

## Next build steps
1. Complete the 52-cell Ludo route and home stretch.
2. Add captures, safe cells, six-roll rules and true four-token win condition.
3. Add secure sign-in and private online rooms.
4. Add server-side admin testing controls.
5. Keep match history persistence disabled unless requested.
