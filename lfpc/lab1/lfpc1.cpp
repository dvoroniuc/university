#include<iostream>
#include<chrono>
#include<string>

using namespace std;

int main(int argc, char const *argv[]){
    char cur_state, button, initial;
    string sentence;
    while(true){
        HERE:
    cur_state = 'S';
    cout << "\n\nInitial point: "<< cur_state << "\n\nEnter expression: ";
    cin >> sentence;
    cout<<"\nPath:\n";
    for(int i = 0; i < sentence.length(); i++){
        button = sentence[i];
        switch(cur_state){
            case 'S':
            switch(button){
                case 'c':
                cur_state = 'I';
                break;
                default: 
                cout<<"\nInvalid expression!";
                goto HERE;
                ;
            };
            break;
            case 'I':
            switch(button){
                case 'b':
                cur_state = 'J';
                break;
                case 'f':
                cur_state = 'I';
                break;
                case 'e':
                cur_state = 'K';
                break;
                case 'm':
                cout<<"terminal point reached"<< "\nValid expression";
                goto HERE;
                
                default: cout<<"\nInvalid expression!";
                goto HERE;
                ;
            };
            break;
            case 'J':
            switch(button){
                case 'c':
                cur_state = 'S';
                break;
                case 'n':
                cur_state = 'J';
                break;
                default: 
                 cout<<"\nInvalid expression!";
                 goto HERE;
                ;
            };
            break;
            case 'K':
            switch(button){
                case 'n':
                cur_state = 'K';
                break;
                case 'c':
                cout<<"terminal point reached"<< "\nValid expression";
                goto HERE;
                
                default: 
                 cout<<"\nInvalid expression!";
                 goto HERE;
                ;
            };
            break;
        }
        printf("%c\n", cur_state);
    }
    cout<<"\nFinal destination - "<<cur_state << "\nSentence is valid!";
    }
    return 0;
}