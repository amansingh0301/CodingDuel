import requests

gfg_compiler_api_endpoint = "https://ide.geeksforgeeks.org/main.php"
languages = ['C', 'Cpp', 'Cpp14', 'Java', 'Python', 'Python3', 'Scala', 'Php', 'Perl', 'Csharp']


def gfg_compile(lang, code, _input=None, save=False):
    data = {
      'lang': lang,
      'code': code,
      'input': _input,
      'save': save
    }
    r = requests.post(gfg_compiler_api_endpoint, data=data)
    return r.json()


if __name__ == "__main__":
    lang = 'Cpp14'
    code = """
    #include <iostream>
    using namespace std;
    int main() {
        int a, b;
        cin >> a >> b;
        cout << (a+b);
        return 0;
    }
    """
    _input = "1 5"
    print(gfg_compile(lang, code, _input))
