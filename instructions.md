## Alembic Migration and Admin Setup Instructions

It seems the previous instructions were not fully visible. Please follow these steps carefully to set up the `is_admin` column and verify the admin features.

---

### Step 1: Navigate to the Backend Directory

Open your terminal and navigate to the `packages/backend` directory:

```bash
cd C:\Users\jiazh\Voli\packages\backend
```

### Step 2: Generate the Migration Script

Run the following command. This will create a new migration file in `alembic/versions/`.

```bash
poetry run alembic revision --autogenerate -m "Add is_admin to User model"
```

**IMPORTANT:** After running this command, please check the output. It should indicate that a new migration file was created. If it shows an error or no new file, please let me know.

### Step 3: Review the Generated Migration File

Open the newly created file in `C:\Users\jiazh\Voli\packages\backend\alembic\versions\` (the filename will be a long string of numbers and letters, e.g., `d1b2c3d4e5f6_add_is_admin_to_user_model.py`).

**Ensure it contains a section that adds the `is_admin` column to the `users` table.** It should look something like this (the exact content might vary slightly):

```python
# ... (other imports and code)

def upgrade():
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=True, server_default=sa.text('false')))

def downgrade():
    op.drop_column('users', 'is_admin')
# ... (rest of the file)
```

If it does NOT contain `op.add_column('users', sa.Column('is_admin', sa.Boolean(), ...))`, please tell me.

### Step 4: Apply the Migration to Your Database

Run the following command to apply the changes to your PostgreSQL database:

```bash
poetry run alembic upgrade head
```

**IMPORTANT:** Check the output of this command. It should indicate that the migration was successfully applied. If it shows an error, please let me know.

### Step 5: Verify 'is_admin' Column Exists and Assign Admin Role (in psql)

First, ensure your PostgreSQL container is running. If not, start it from the project root (`C:\Users\jiazh\Voli`):

```bash
docker compose up -d db
```

Then, access your database container and connect to psql:

```bash
docker exec -it voli-db-1 bash
psql -U user -d db
```

Once you are in the psql prompt (`db=#`), run the following SQL command, replacing `your_email@example.com` with the actual email of the user you want to make an admin:

```sql
UPDATE users SET is_admin = TRUE WHERE email = 'your_email@example.com';
```

It should say `UPDATE 1`. If it gives an error like "column \"is_admin\" does not exist", please tell me.

Type `\q` to exit psql and then `exit` to leave the container.

### Step 6: Restart Your Development Servers

Navigate back to the project root (`C:\Users\jiazh\Voli`):

```bash
cd C:\Users\jiazh\Voli
```

Then, restart your development servers:

```bash
pnpm dev
```

### Step 7: Test the Admin Page

Log in with the user you just made an admin and navigate to `http://localhost:3002/admin` to verify the admin page and its functionality (user list, delete, assign admin).

---

Once you have completed all these steps, please let me know!