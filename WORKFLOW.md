# Bedrock — Git Workflow

## First-time setup (run once per machine)

```bash
cd ~/Documents/Bedrock
bash setup-git.sh
```

**On the MacBook** (one-liner, run in Terminal):
```bash
cd ~ && mv Documents/Bedrock Documents/Bedrock-backup 2>/dev/null; git clone https://github.com/katherinesdey-netizen/bedrock.git Documents/Bedrock
```
Then open the `Bedrock` folder in Cowork.

---

## Daily workflow

**Start of session** — pull any changes:
```bash
cd ~/Documents/Bedrock && git pull
```

**End of session** — push your changes:
```bash
cd ~/Documents/Bedrock
git add index.html
git commit -m "brief description of what you changed"
git push
```

---

## Tips

- Always `git pull` first if you've worked on the other machine since your last session.
- GitHub Pages updates ~1 min after push. Live at: https://katherinesdey-netizen.github.io/bedrock/
- If you ever get a merge conflict (shouldn't happen with a single file + one editor at a time), just let Claude know.
