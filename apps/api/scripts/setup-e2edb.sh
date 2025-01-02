#!/bin/bash

set -e

trap 'echo -e "\033[31m✖ An error occurred. Exiting...\033[0m"; exit 1;' ERR

DATABASE_URL='postgresql://pets:pets@localhost:5432/pets?schema=public' pnpm db:migrate-dev && DATABASE_URL='postgresql://pets:pets@localhost:5432/pets?schema=public' pnpm prisma db push
echo -e "\033[32m✔ Test Database migrated\033[0m"