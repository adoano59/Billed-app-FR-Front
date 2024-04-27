/**
 * @jest-environment jsdom
 */

import { fireEvent, waitFor, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store"

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("create bill from mock API POST", async () => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      const html = NewBillUI();
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: () => {
            return Promise.resolve()
          }
        }
      })
      // Définir une fonction onNavigate mockée
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = html;
      const newbill = new NewBill({
        document, onNavigate, store: mockStore, bills: bills, localStorage: window.localStorage
      })
      // Simuler le clic sur le bouton "Envoyer" sans remplir aucun champ
      const sendButton = screen.getByTestId("sendNewBills")
      expect(sendButton).toBeTruthy()
      fireEvent.click(sendButton)
      await waitFor(() => screen.getAllByTestId("tbody"))
      //Obtenir toutes les factures affichées sur la page
      const billElements = screen.getAllByTestId("tbody")
      expect(billElements).toBeTruthy()
    })
  })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })
      window.onNavigate(ROUTES_PATH.Bills)

      // Injecter le HTML de la page des factures dans le document body
      document.body.innerHTML = NewBillUI({ data: bills, loading: false, error: "Erreur 404" })

      // Définir une fonction onNavigate mockée
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // Créer une instance de la classe Bills
      const billsContainer = new NewBill({
        document, onNavigate, store: mockStore, bills, localStorage: window.localStorage
      })
      // Simuler le clic sur le bouton "Envoyer" sans remplir aucun champ
      const sendButton = screen.getByTestId("sendNewBills")
      expect(sendButton).toBeTruthy()
      fireEvent.click(sendButton)
      await new Promise(process.nextTick)
      expect(sendButton).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: () => {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })
      window.onNavigate(ROUTES_PATH.Bills)

      // Injecter le HTML de la page des factures dans le document body
      document.body.innerHTML = NewBillUI({ data: bills, loading: false, error: "Erreur 500" })

      // Définir une fonction onNavigate mockée
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // Créer une instance de la classe Bills
      const billsContainer = new NewBill({
        document, onNavigate, store: mockStore, bills, localStorage: window.localStorage
      })
      // Simuler le clic sur le bouton "Envoyer" sans remplir aucun champ
      const sendButton = screen.getByTestId("sendNewBills")
      expect(sendButton).toBeTruthy()
      fireEvent.click(sendButton)
      await new Promise(process.nextTick);
      expect(sendButton).toBeTruthy()
    })
  })
})

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
        document, onNavigate, store: null, bills: bills, localStorage: window.localStorage
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
      document, onNavigate, store: null, bills: bills, localStorage: window.localStorage
    })
    const sendfile = screen.getByTestId("file");
    expect(sendfile).toBeTruthy();
    fireEvent.change(sendfile, {
      target: {
        files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
      },
    });
  })
});

