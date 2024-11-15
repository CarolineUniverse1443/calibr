const app = {
    data() {
        return {
            route:'home',
            nav:[
                {title:'Home', name:'home'},
                {title:'Signup', name:'signup'},
                {title:'Signin', name:'signin'},
                {title:'Products', name:'products'},
                {title:'Admin', name:'admin'},

            ],
            formMode: 'create',
            // currentProduct: null,
            products: [],
            clients: [],
            purchases: [],
            // singleProduct:null,
            productForm: {
                type_id: 0,
                type_of_goods: '',
                product_name: '',
                characteristic: '',
                product_price: 0
            },
            commonForm: {
                type_id: 0,
                type_of_goods: '',
                product_name: '',
                characteristic: '',
                product_price: 0,

                login:'',
                password:'',
                name:'',
                surname:'',
                passport_series:'',
                passport_id:'',
                weapon_license_number:'',
                phone_number:'',
                patronymic:'',
                status:'user',

                purchase_id: 0,
                employee_id: 0,
                product_id: 0,
                purchase_date: '',
                client_id: 0,
                number: 0,
                price: 0
            },
            // formSign:false,
            formSignUser:{
                phone_number:'',
                password:''
            },
            UserForm:{
                login:'',
                password:'',
                name:'',
                surname:'',
                passport_series:'',
                passport_id:'',
                weapon_license_number:'',
                phone_number:'',
                patronymic:'',
                status:'user',
            },
            User_api:[],
            // userActive:false,
            // adminActive:false,
            status: 'user',
            table: 'products',
            token: null,
            finder: '',
            addVisible: false
            // page: 'signin',
        }
    },

    methods: {
        async fetchProducts() {
            const response = await fetch('http://caliber/api/products')
            console.log(response);
            const result = await response.json()
            this.products = result
            console.log(result)
        },
        async createProduct() {
            const response = await fetch('http://caliber/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.productForm)

            })
 
            const result = await response.json()
            this.products.push(result)

            this.productForm = {
                type_id: 0,
                type_of_goods: '',
                product_name: '',
                characteristic: '',
                product_price: 0
            }
        },

        async productDelete(id) {
            const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
                method: 'DELETE',
            })
            if (response.status === 200) {
                this.products = this.products.filter(p => p.id !== id)

            }
        },

        async updateProduct() {
            const response = await fetch(`http://127.0.0.1:8000/api/products/${this.currentProduct.id}`, {
                method: 'PATCH',
                headers: {
                    mode:"no-cors",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.productForm)
            })
            if (response.status === 200) {
                this.products = this.products.map(p => {
                    if (p.id === this.currentProduct.id) {
                        p.type_id = this.productForm.type_id;
                        p.type_of_goods = this.productForm.type_of_goods;
                        p.product_name = this.productForm.product_name;
                        p.characteristic = this.productForm.characteristic;
                        p.product_price = this.productForm.product_price;
                    }
                    return p
                })
            }
            this.formMode = 'create'
        },

        editProduct(product) {
            this.formMode = 'edit'
            this.currentProduct = product
            this.productForm.type_id = product.type_id
            this.productForm.type_of_goods = product.type_of_goods
            this.productForm.product_name = product.product_name
            this.productForm.characteristic = product.characteristic
            this.productForm.product_price = product.product_price
        },

        register(){
            console.log(this.UserForm)
            fetch('http://caliber/api/register', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.UserForm)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.route = 'signin'
            }) 
        },
        signin(){
            console.log(this.formSignUser)
            fetch('http://caliber/api/signin', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.formSignUser)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.route = 'home'
                // this.section = 'main'
                this.status = data.status
                this.token = data.token
                // document.cookie = `cookie_token=${this.token}`
                // this.form.client_phone = ''
                // this.form.password = ''
                // this.form.client_id = data.id
                console.log(this.token)
                
            }) 
        },
        logout()
        {
            fetch('http://caliber/api/logout', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                },
                body: JSON.stringify(this.SignUser)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.route = 'home'
                this.status = 'user'
                // this.table = ''
                this.token = null
                // document.cookie = `cookie_token=null`
                // console.log(localStorage.getItem('cookie_token'))
            })
        },
        getEntries(table)
        {
            fetch(`http://caliber/api/${table}`)
            .then(response => response.json())
            .then(entries => {
                console.log(entries)
                if(table == 'purchases') this.purchases = entries
                if(table == 'clients') this.clients = entries
                if(table == 'products') this.products = entries
                this.table = table
                // if(this.role == 'admin') this.table = table
                // this.error = ''
            })
        },
        addStuff(table)
        {
            console.log(this.commonForm)
            fetch(`http://caliber/api/${table}`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                },
                body: JSON.stringify(this.commonForm)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.getEntries(this.table)
                this.commonForm = {
                    type_id: 0,
                    type_of_goods: '',
                    product_name: '',
                    characteristic: '',
                    product_price: 0,
    
                    login:'',
                    password:'',
                    name:'',
                    surname:'',
                    passport_series:'',
                    passport_id:'',
                    weapon_license_number:'',
                    phone_number:'',
                    patronymic:'',
                    status:'user',
    
                    purchase_id: 0,
                    employee_id: 0,
                    product_id: 0,
                    purchase_date: '',
                    client_id: 0,
                    number: 0,
                    price: 0
                },
                this.addVisible = false
            })
        },
        closeForm(){
            this.addVisible = false
            this.commonForm = {
                type_id: 0,
                type_of_goods: '',
                product_name: '',
                characteristic: '',
                product_price: 0,

                login:'',
                password:'',
                name:'',
                surname:'',
                passport_series:'',
                passport_id:'',
                weapon_license_number:'',
                phone_number:'',
                patronymic:'',
                status:'user',

                purchase_id: 0,
                employee_id: 0,
                product_id: 0,
                purchase_date: '',
                client_id: 0,
                number: 0,
                price: 0
            }
        },
        fillProduct(id, name, char, price)
        {
            this.formMode = 'edit'
            this.addVisible = true
            this.commonForm.product_id = id
            this.commonForm.product_name = name
            this.commonForm.characteristic = char
            this.commonForm.product_price = price
        },
        fillClient(client)
        {
            this.formMode = 'edit'
            this.addVisible = true
            this.commonForm.client_id = client.client_id
            this.commonForm.surname = client.surname
            this.commonForm.name = client.name
            this.commonForm.patronymic = client.patronymic
            this.commonForm.passport_series = client.passport_series
            this.commonForm.passport_id = client.passport_id
            this.commonForm.weapon_license_number = client.weapon_license_number
            this.commonForm.phone_number = client.phone_number
            this.commonForm.password = client.password
        },
        fillPurchase(purchase)
        {
            this.formMode = 'edit'
            this.addVisible = true
            this.commonForm.purchase_id = purchase.purchase_id
            this.commonForm.employee_id = purchase.employee_id
            this.commonForm.type_id = 0
            this.commonForm.type_of_goods = ''
            this.commonForm.product_name = purchase.product_name
            this.commonForm.purchase_date = purchase.purchase_date
            this.commonForm.client_id = purchase.purchase_id
            this.commonForm.surname = purchase.surname
            this.commonForm.name = purchase.name
            this.commonForm.patronymic = purchase.patronymic
            this.commonForm.weapon_license_number = purchase.weapon_license_number
            this.commonForm.number = purchase.number
            this.commonForm.price = purchase.price
        },
        editStuff(id, table)
        {
            console.log(this.commonForm)

            fetch(`http://caliber/api/${table}/${id}`, {
                method: 'patch',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                },
                body: JSON.stringify(this.commonForm)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.formMode = 'create'
                this.getEntries(this.table)
                this.commonForm = {
                    type_id: 0,
                    type_of_goods: '',
                    product_name: '',
                    characteristic: '',
                    product_price: 0,
    
                    login:'',
                    password:'',
                    name:'',
                    surname:'',
                    passport_series:'',
                    passport_id:'',
                    weapon_license_number:'',
                    phone_number:'',
                    patronymic:'',
                    status:'user',
    
                    employee_id: 0,
                    product_id: 0,
                    purchase_date: '',
                    client_id: 0,
                    number: 0,
                    price: 0
                }
                this.addVisible = false
            })
        },
        destroy(id, table)
        {
            console.log('hello')
            fetch(`http://caliber/api/${table}/${id}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.getEntries(this.table)
            })
        },
        // async signinUser(){
        //     // const response = await fetch('http://127.0.0.1:8000/api/signin',
        //     // {
        //     //     method: 'POST',
        //     //     headers: {
        //     //         'Content-Type': 'application/json'
        //     //     },
        //     //     body: JSON.stringify(this.formSignUser) 
        //     // })
        //     // const result = await response.json()
        //     // console.log(result)
        //     formSignUser={
        //         phone_number:'',
        //         password:''
        //     }
        //     const response = await fetch('http://127.0.0.1:8000/api/signin', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }, 
        //         body: JSON.stringify(this.formSignUser)
        //     })
        //     const data = await response.json()
        //     this.User_api.push(data)
        //     if (this.User_api[0].status == 'user') {
        //         this.User_api[0].status = 'user'
        //         this.userActive = true
        //         this.route = 'home'
        //         localStorage.setItem('api_token', this.User_api[0].api_token)
        //     } else if (this.User_api[0].status == 'admin') {
        //         this.userActive.status = 'admin'
        //         this.userActive = true
        //         this.adminActive = true
        //         localStorage.setItem('api_token', this.User_api[0].api_token)
        //         this.route = 'admin'
        //     }
        // },
        // async fetchToCome() {
        //     let api_token = localStorage.getItem('api_token');
        //     console.log(api_token)
        //     if (api_token != null) {
        //         const response = await fetch(`http://127.0.0.1:8000/api/search_api/${api_token}`)
        //         if (response.status == 200) {
        //             const result = await response.json()
        //             this.User_api.push(result)
        //             if (this.User_api[0].api_token == api_token) {
        //                 if (this.User_api[0].status == 'user') {
        //                     this.userActive.status = 'user'
        //                     console.log(this.User_api[0].status)
        //                     this.userActive = true
        //                     this.route = 'private'
        //                     localStorage.setItem('api_token', this.User_api[0].api_token)
        //                 } else if (this.User_api[0].status == 'admin') {
        //                     console.log('da')   
        //                     this.userActive.status = 'admin'
        //                     this.userActive = true
        //                     this.adminActive = true
        //                     this.route = 'private'
        //                     localStorage.setItem('api_token', this.User_api[0].api_token)
        //                 }
        //             }
        //         }
        //     }
        //     else{
        //         console.log('net')
        //     }
        // },
    },

    watch:{
        route(){
            console.log(this.route)
        },
        finder() {
            if(this.finder == '') this.getEntries(this.table)
            else{
                fetch(`http://caliber/api/${this.table}/${this.finder}`)
                    .then(response => response.json())
                    .then(entry => {
                        if(this.table == 'purchases') this.purchases = [entry]
                        if(this.table == 'clients') this.clients = [entry]
                        if(this.table == 'products') this.products = [entry]
                    })
            }
        }
    },
    created() {
        this.fetchProducts()
        // this.fetchToCome()
        console.log(this.UserForm)
        console.log(this.route)
    }
}

Vue.createApp(app).mount('#app')