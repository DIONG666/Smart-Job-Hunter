import pdfplumber

def read_pdf_file(filename):
    with pdfplumber.open(filename) as pdf:
        first_page = pdf.pages[0]
        text = first_page.extract_text()
    return text

if __name__ == '__main__':
    text = read_pdf_file('test.pdf')
    print(text)