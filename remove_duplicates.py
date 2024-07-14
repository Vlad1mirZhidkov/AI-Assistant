import re

print("Running remove_duplicates.py...")

# Чтение changelog файла
with open('CHANGELOG.md', 'r', encoding='utf-8') as file:
    lines = file.readlines()

# Функция для удаления дубликатов
def remove_duplicates(lines):
    seen = set()
    result = []
    skip_next = False

    for line in lines:
        stripped_line = line.strip()
        
        # Сохранение пустых строк (для разделения разделов)
        if stripped_line == "":
            result.append(line)
            continue

        # Проверка, содержит ли строка email
        email_match = re.match(r'\(.*@.*\)', stripped_line)
        print(email_match)
        if email_match:
            if stripped_line in seen:
                continue
            else:
                seen.add(stripped_line)
                result.append(line)
            continue

        # Удаление дубликатов строк без учета пробелов
        if stripped_line in seen:
            continue
        
        seen.add(stripped_line)
        result.append(line)

    return result

# Удаление дубликатов
cleaned_lines = remove_duplicates(lines)

# Запись очищенного файла
with open('CHANGELOG.md', 'w', encoding='utf-8') as file:
    file.writelines(cleaned_lines)

print("Finished removing duplicates.")
