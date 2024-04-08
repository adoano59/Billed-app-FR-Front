/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { fireEvent } from '@testing-library/dom'; // j'ai utiliser fireEvent pour simuler des événements DOM
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I am prompted to fill in the Date field in the correct format", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // Récupérer le code HTML de la page NewBill1
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newbill = new NewBill({
        document, onNavigate, store: null, bills:bills, localStorage: window.localStorage
      })
      
 

      // Simuler le clic sur le bouton "Envoyer" sans remplir aucun champ
      const sendButton = screen.getByTestId("sendNewBills");
      expect(sendButton).toBeTruthy();
      fireEvent.click(sendButton);

      // Vérifier si l'utilisateur est resté sur la page NewBill
      expect(sendButton).toBeTruthy();
    });
  });
  test("Then I am prompted to fill in the Date field in the correct format", () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    // Récupérer le code HTML de la page NewBill1
    const html = NewBillUI();
    document.body.innerHTML = html;
    const newbill = new NewBill({
      document, onNavigate, store: null, bills:bills, localStorage: window.localStorage
    })
    const sendfile = screen.getByTestId("file");
      expect(sendfile).toBeTruthy();
      fireEvent.change(sendfile,{
        target: {
          files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
        },
      });
  })
});

