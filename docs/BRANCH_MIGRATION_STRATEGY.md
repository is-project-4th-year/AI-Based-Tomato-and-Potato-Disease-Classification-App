# Branch Migration Strategy Document

**Author:** Peter Maina (136532)
**Date:** 2025-10-27
**Project:** AI-Based Tomato & Potato Disease Classification
**Purpose:** Migrate Claude branch to main, preserve legacy main as backup

---

## Executive Summary

**Current State:**
- **main branch:** Nearly empty (only README.md, Learn_documentation.md)
- **claude branch:** Contains ALL project implementation (17+ files, complete ML pipeline)

**Objective:**
Replace `main` branch content with `claude` branch content, preserving original main as `legacy/main-backup`

**Risk Level:** LOW (main has minimal content, easy rollback)

---

## Branch Analysis

### Branch: `main`
**Commit:** `c8935eb - Add learning documentation`

**Content:**
```
.github/.keep
Learn_documentation.md
README.md
venv/ (should be gitignored)
```

**Status:** Nearly empty - only setup files, no implementation

---

### Branch: `claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp`
**Common Ancestor:** `c8935eb - Add learning documentation`
**Latest Commit:** `ab74f0b - Save MobileNetV2 training progress from Colab session`

**Content (New Files Added):**
```
.gitignore
data/
  ├── configs/data_config.yaml
  └── scripts/
      ├── download_dataset.py
      ├── preprocess_data.py
      └── split_dataset.py
docs/
  ├── COLAB_SETUP.md
  ├── LOCAL_SETUP.md
  ├── QUICK_REFERENCE.md
  └── tips/colab-keep-alive.md
ml/
  ├── config.yaml
  ├── evaluation.py
  ├── inference.py
  ├── models.py
  ├── training.py
  ├── utils.py
  └── notebooks/
      ├── colab_training.ipynb (with training output)
      └── data_exploration.ipynb
requirements.txt
```

**Key Commits:**
1. `330deed` - Implement complete Google Colab training pipeline
2. `8501715` - Add .gitignore to exclude Python cache and data files
3. `60d8845` - Add comprehensive setup documentation
4. `bf9e71a` - Fix dataset organization logic
5. `f19f138` - Add support for plantvillage dataset directory with spaces
6. `28b7ba5` - Handle nested dataset structure
7. `d091cd4` - Fix image validation for case-insensitive extensions
8. `3bc68fa` - Add Colab keep-alive tip
9. `bad7d11` - Update keep-alive script for better activity simulation
10. `ab74f0b` - Save MobileNetV2 training progress (89.6% val accuracy)

**Status:** Complete implementation - production-ready ML pipeline

---

## Migration Strategy

### Option A: Hard Reset (RECOMMENDED)
**Method:** Replace main entirely with claude branch content

**Advantages:**
- ✅ Clean history
- ✅ Simple execution
- ✅ No merge conflicts
- ✅ Easy to understand for team

**Disadvantages:**
- ⚠️ Rewrites main branch history (requires force push)
- ⚠️ Team must re-clone if they have main checked out

**Steps:**
1. Create backup branch `legacy/main-backup` from current main
2. Hard reset `main` to claude branch head
3. Force push `main` to remote
4. Delete old claude branch (optional)
5. Verify with team

---

### Option B: Merge with Ours Strategy
**Method:** Merge claude into main, taking all claude changes

**Advantages:**
- ✅ Preserves history
- ✅ No force push required
- ✅ Git shows explicit merge

**Disadvantages:**
- ⚠️ More complex history
- ⚠️ Potential conflicts with venv/ directory

**Steps:**
1. Checkout main
2. Merge claude with `--strategy=ours` (take all claude changes)
3. Push to remote
4. Clean up

---

### Option C: Branch Rename
**Method:** Delete main, rename claude to main

**Advantages:**
- ✅ Very clean
- ✅ Preserves all claude branch history

**Disadvantages:**
- ⚠️ Loses main branch identity
- ⚠️ Requires coordination with remote

**Steps:**
1. Backup current main as `legacy/main-backup`
2. Delete main locally and remotely
3. Rename claude to main
4. Push as new main

---

## Selected Strategy: Option A (Hard Reset)

**Rationale:**
- Main branch has minimal content worth preserving
- Clean history is valuable for future development
- Team is small, coordination is easy
- Original main is backed up in `legacy/main-backup`

---

## Execution Plan

### Phase 1: Backup Current Main
```bash
# Create legacy backup branch from current main
git checkout main
git branch legacy/main-backup
git push origin legacy/main-backup
```

**Verification:**
- Branch `legacy/main-backup` exists locally
- Branch `legacy/main-backup` exists on remote
- Branch contains original main content

---

### Phase 2: Synchronize Claude Branch
```bash
# Ensure claude branch is up-to-date
git checkout claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp
git push origin claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp
```

**Verification:**
- Latest commit (ab74f0b) is on remote
- All 17+ files are committed
- Training notebook contains progress data

---

### Phase 3: Replace Main with Claude Content
```bash
# Reset main to claude branch
git checkout main
git reset --hard claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp

# Force push to remote (DESTRUCTIVE - team must be notified)
git push origin main --force
```

**⚠️ CRITICAL WARNING:**
- This REWRITES main branch history
- Anyone with main checked out locally must run: `git fetch origin && git reset --hard origin/main`
- Notify team BEFORE executing

**Verification:**
- `git log main --oneline -5` shows claude commits
- `git diff main legacy/main-backup` shows all new files
- Remote main shows updated content

---

### Phase 4: Clean Up (Optional)
```bash
# Option 1: Keep claude branch for reference
# Do nothing

# Option 2: Delete claude branch after successful migration
git branch -d claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp
git push origin --delete claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp
```

**Recommendation:** Keep claude branch for 1-2 weeks, then delete after confirming stability

---

## Rollback Plan

If migration causes issues:

```bash
# Restore original main from backup
git checkout main
git reset --hard legacy/main-backup
git push origin main --force

# Or if remote wasn't pushed:
git fetch origin
git reset --hard origin/legacy/main-backup
git push origin main --force
```

**Recovery Time:** < 5 minutes
**Data Loss:** None (everything backed up)

---

## Pre-Migration Checklist

- [ ] All team members notified of migration
- [ ] Current work on claude branch is committed
- [ ] Claude branch is pushed to remote
- [ ] No one is actively working on main branch
- [ ] Backup plan understood
- [ ] Have SSH/HTTPS credentials ready for force push

---

## Post-Migration Checklist

- [ ] `git log main --oneline -10` shows claude commits
- [ ] All 17+ files exist in main
- [ ] Remote main updated successfully
- [ ] `legacy/main-backup` branch exists
- [ ] Team notified to pull latest main
- [ ] GitHub default branch set to main (if changed)
- [ ] CI/CD pipelines updated (if applicable)
- [ ] Documentation updated to reference main branch

---

## Team Communication Template

**Subject:** [URGENT] Main Branch Migration - Action Required

**Body:**

Team,

We are performing a branch migration on **[DATE/TIME]**:

**What's Happening:**
- The `claude/review-project-requirements-011CUL385Az2oYMhaokmzFPp` branch will become the new `main`
- Current `main` will be backed up as `legacy/main-backup`
- This is a **force push** operation

**Action Required If You Have `main` Checked Out:**

```bash
git fetch origin
git checkout main
git reset --hard origin/main
```

**Why:**
- Claude branch contains the complete project implementation
- Current main is nearly empty
- Clean history for future development

**Timeline:**
- Backup creation: [TIME]
- Force push: [TIME]
- Verification: [TIME]

**Questions:** Contact Peter Maina

---

## File Integrity Verification

### Critical Files to Verify After Migration:
1. ✅ `.gitignore` - Excludes venv, __pycache__, data files
2. ✅ `requirements.txt` - All dependencies listed
3. ✅ `ml/training.py` - Complete training pipeline
4. ✅ `ml/models.py` - MobileNetV2 architecture
5. ✅ `data/scripts/download_dataset.py` - Dataset download with all fixes
6. ✅ `docs/COLAB_SETUP.md` - Complete setup guide
7. ✅ `ml/notebooks/colab_training.ipynb` - Training progress preserved

### Verification Command:
```bash
# Count files in main after migration
git checkout main
find . -type f ! -path "./.git/*" ! -path "./venv/*" | wc -l
# Expected: 17+ files

# Verify key files exist
ls -l .gitignore requirements.txt ml/training.py docs/COLAB_SETUP.md
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Accidental data loss | LOW | HIGH | Full backup in `legacy/main-backup` |
| Team member has uncommitted work | MEDIUM | LOW | Pre-migration notification |
| Force push fails | LOW | LOW | Retry with credentials check |
| CI/CD breaks | LOW | MEDIUM | Update pipeline configs |
| GitHub protection rules block push | MEDIUM | LOW | Temporarily disable, re-enable after |

**Overall Risk Level:** LOW

---

## Success Criteria

Migration is successful when:

1. ✅ `main` branch contains all 17+ files from claude branch
2. ✅ Latest commit on main is `ab74f0b` (MobileNetV2 training progress)
3. ✅ `legacy/main-backup` exists with original main content
4. ✅ Remote repository updated
5. ✅ No team members report lost work
6. ✅ All documentation references correct branch
7. ✅ Training pipeline runs successfully from main

---

## Timeline

**Estimated Duration:** 10-15 minutes

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Backup main branch | 2 min |
| 2 | Sync claude branch | 1 min |
| 3 | Reset and force push main | 2 min |
| 4 | Verification | 3 min |
| 5 | Team notification | 2 min |
| **TOTAL** | | **10 min** |

---

## Approval

**Prepared By:** Peter Maina (136532)
**Reviewed By:** [To be filled]
**Approved By:** [To be filled]
**Execution Date:** [To be scheduled]

---

## Post-Migration Notes

[To be filled after migration]

**Actual Duration:**
**Issues Encountered:**
**Resolutions:**
**Team Feedback:**

---

**END OF DOCUMENT**
