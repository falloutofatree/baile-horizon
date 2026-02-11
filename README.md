# shopify-theme-init

Pragmatic workflow for developing and maintaining stores built on off-the-shelf Shopify themes:

* Keep theme code in version control
* Pull in Shopify Admin code/template changes (including Theme Store updates)
* Exclude content and settings from Git

---

## 🧹 Install

### 1. Install a theme via Shopify Admin

Choose a theme from the Shopify Theme Store.
Note its numeric ID (visible in the URL when previewing or editing).

### 2. Pull in this repo

```bash
git init
git remote add workflow [this-repo-url]
git pull workflow main
git remote remove workflow
```

### 3. Configure Shopify CLI

Edit `shopify.theme.toml`:

```toml
[environments.default]
store = "yourstore.myshopify.com"
theme = "your-theme-id"
```

### 4. Pull theme files

Install [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) if needed:

```bash
shopify auth login
shopify theme pull
```

### 5. Commit to your GitHub repo

```bash
git add . && git commit -m "feat: initial commit"
git remote add origin git@github.com:[your-org]/[theme-repo].git
git push -u origin main
```

You're ready to develop.

---

## 🧑‍💻 Usage

```bash
shopify theme pull && git diff  # Pull and inspect any admin-side changes
# Make your changes
shopify theme dev               # Preview locally
git add . && git commit -m "feat: initial commit"
git push origin main
shopify theme push              # Deploy (skips content/settings)
```

---

## 🔄 Shopify Admin Updates

Shopify or merchants may update the theme outside your workflow:

* **Admin-side template changes or auto-updates**
  Run `shopify theme pull && git diff` to detect unexpected file changes.

* **Manual theme updates via Theme Store**
  Shopify will duplicate the theme and apply changes. To stay in sync:

  ```bash
  shopify theme list                 # Check the published theme ID
  shopify theme open --theme=<ID>    # Preview if needed
  ```

  If the theme has changed, update the theme ID in `shopify.theme.toml`.

Once    changes are pulled and you've made sure they're actually compatible, commit them back to the repo.

---

## ⚠️ (Optional) Track settings

By default, `config/settings_data.json` is ignored.
If you want to version control site settings:

Comment out `config/settings_data.json` in `.gitignore`

**Warning:** We *strongly* recommend keeping it ignored.

