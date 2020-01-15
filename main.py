def greeting():
    name = input("Please tell me your name: ")
    return "hello " + name + "!"


if __name__ == "__main__": 
    print(greeting())