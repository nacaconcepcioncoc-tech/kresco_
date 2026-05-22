If you have made edits to your template files, make sure they're saved in VS Code (Ctrl+S), then let me know. I'll run the full update process:

python build_static.py — rebuild the static site
git add . — stage changes
git commit -m "..." — commit
git push — push to GitHub (site auto-updates)

Edit templates → Run build_static.py → git add . → git commit → git push
