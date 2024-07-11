import re

# Чтение changelog файла
with open('CHANGELOG.md', 'r', encoding='utf-8') as file:
    lines = file.readlines()

# Функция для удаления дубликатов
def remove_duplicates(lines):
    seen = set()
    result = []
    for line in lines:
        if line.strip() in seen:
            continue
        seen.add(line.strip())
        result.append(line)
    return result

# Удаление дубликатов
cleaned_lines = remove_duplicates(lines)

# Запись очищенного файла
with open('CHANGELOG.md', 'w', encoding='utf-8') as file:
    file.writelines(cleaned_lines)
