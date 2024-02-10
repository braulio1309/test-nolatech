//Librerías y servicios
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('../Services/jwt');
const functions = require('../Services/functions')
const pool = require('../database');


const user = {

    crear:async function(req, res) {
       
        let params = req.body;
        //Validar datos
        params.firstname   = (params.firstname == undefined)?'':params.firstname;
        params.lastname = (params.lastname == undefined)?'':params.lastname;
        params.email    = (params.email == undefined)?'':params.email;
        params.password = (params.password == undefined)?'':params.password;
        params.username  = (params.username == undefined)?'':params.username;

        let validate_firstname     = !validator.isEmpty(params.firstname);
        let validate_lastname   = !validator.isEmpty(params.lastname);
        let validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        let validate_pass       = !validator.isEmpty(params.password);
        let validate_username       = !validator.isEmpty(params.username);

        if(validate_firstname && validate_pass && validate_lastname && validate_email && validate_username){
            //Verificamos si existe
            let user =  {
                firstname: params.firstname,
                lastname: params.lastname,
                password: params.password,
                username: params.username,
                email: params.email
            };
            
            const verify = await pool.query(`SELECT * FROM users WHERE email = '${params.email}' OR username= '${params.username}'`);
            if(verify.length > 0){
                return res.status(400).send({
                    'message': 'Usuario ya existe'
                });
            }else{
                //Guardo en la base de datos
                bcrypt.hash(params.password, 4, async function(err, hash) {
                    let data = {
                        firstname: params.firstname,
                        lastname: params.lastname,
                        password: hash,
                        username: params.username,
                        email: params.email
                    }
                    
                    if(functions.insert('users', data)){
                        return res.status(200).send({
                            'message': 'Usuario registrado exitosamente',
                            'user': user
                        }); 
                    }else{
                        return res.status(400).send({
                            'message': 'Error al guardar el DES_USUARIO',
                           
                        }); 
                    }
                });
            }

        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos,  intentelo de nuevo'
            });

        }
    },

    show: async function(req, res){
       return functions.show(req, res, 'Select * from users');
    },

    login:async function(req, res){

        let params = req.body;

        //Validamos datos
        params.DES_CORREO    = (params.DES_CORREO == undefined)?'':params.DES_CORREO;
        params.DES_PASS = (params.DES_PASS == undefined)?'':params.DES_PASS;

        let validate_DES_CORREO      = !validator.isEmpty(params.DES_CORREO) && validator.isEmail(params.DES_CORREO);
        let validate_pass       = !validator.isEmpty(params.DES_PASS);
        let user = Usuario;
        if(validate_DES_CORREO && validate_pass){

            //Buscar DES_USUARIO si coincide
            const verifica = await pool.query(consulta.search('USUARIOS', 'DES_CORREO', user.DES_CORREO, 'equals'))
            if(verifica){

                //Verificamos la contraseña
                user.DES_CORREO = params.DES_CORREO;
                user.DES_PASS = params.DES_PASS;
                console.log(consulta.custom(`SELECT * FROM DES_USUARIOs WHERE DES_CORREO = '${user.DES_CORREO}'`))
                let DES_USUARIO = await pool.query(consulta.custom(`SELECT * FROM DES_USUARIOs WHERE DES_CORREO = '${user.DES_CORREO}'`));

                console.log(DES_USUARIO)
                bcrypt.compare(params.DES_PASS, DES_USUARIO[0].DES_PASS, (err, check) => {
                    
                    if(check){
                        //generamos JWT
                        if(params.gettoken){
                            return res.status(200).send({
                               token: jwt.createToken(DES_USUARIO[0]),

                            }); 
                        }

                    }else{
                        return res.status(400).send({
                            'message': 'El DES_USUARIO no existe'
                        });
                    }
                })
            }
        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });
        }

        
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        params.firstname   = (params.firstname == undefined)?'':params.firstname;
        params.lastname = (params.lastname == undefined)?'':params.lastname;
        params.email    = (params.email == undefined)?'':params.email;
        params.password = (params.password == undefined)?'':params.password;
        params.username  = (params.username == undefined)?'':params.username;
        
        let validate_firstname     = !validator.isEmpty(params.firstname);
        let validate_lastname   = !validator.isEmpty(params.lastname);
        let validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        let validate_pass       = !validator.isEmpty(params.password);
        let validate_user       = !validator.isEmpty(params.username);
       
       

        if((validate_firstname || validate_lastname || validate_email|| validate_pass || validate_user) && req.user.sub == id){ //Valido que solo el DES_USUARIO pueda modificar su propio DES_USUARIO
            let user =  Usuario;

            //Valido duplicidad
            if(params.email != ''){
                let email =  await pool.query(`SELECT * FROM users WHERE email = '${params.email}' OR username= '${params.username}'`)
                if(email.length != 0){
                    return res.status(400).send({
                        'message': 'El correo ya fue tomado'
                    });
                }
            }

            //Busco el DES_USUARIO a actualizar y verifico si existe
            let userUpdate =  await pool.query(`SELECT * FROM users WHERE id = '${req.user.sub}'`);

            if(userUpdate.length == 0){
                return res.status(400).send({
                    'message': 'Usuario no existe'
                });
            }else{
                //Valido la entrada de datos
                DES_USUARIO = DES_USUARIO[0]
                user.DES_NOMBRE   = (params.DES_NOMBRE == '')?DES_USUARIO.DES_NOMBRE:params.DES_NOMBRE;
                user.DES_APELLIDO = (params.DES_APELLIDO == '')?DES_USUARIO.DES_APELLIDO: params.DES_APELLIDO;
                user.DES_PASS = (params.DES_PASS == '')?DES_USUARIO.DES_PASS:params.DES_PASS;
                user.DES_USUARIO  = (params.DES_USUARIO == '')?DES_USUARIO.DES_USUARIO:params.DES_USUARIO;
                user.DES_CORREO    = (params.DES_CORREO == '')?DES_USUARIO.DES_CORREO:params.DES_CORREO;

                let data = {
                    ID: id,
                    firstname: (params.firstname == '')?userUpdate.firstname:params.firstname,
                    lastname: (params.lastname == '')?userUpdate.lastname:params.lastname,
                    username: (params.username == '')?userUpdate.username:params.username,
                    email: (params.email == '')?userUpdate.email:params.email,

                }
                //Guardo en la base de datos
                if(params.password == undefined){
                    if(functions.update('users', data)){
                        return res.status(200).send({
                            'message': 'Usuario actualizado exitosamente',
                            'user': user
                        }); 
                    }else{
                        return res.status(400).send({
                            'message': 'Error al actualizar el DES_USUARIO',
                           
                        }); 
                    }
                }else{
                    bcrypt.hash(params.DES_PASS, 4, function(err, hash) {
                        data.password = hash;
                        if(functions.update('users', data)){
                            return res.status(200).send({
                                'message': 'Usuario actualizado exitosamente',
                                'user': data
                            }); 
                        }else{
                            return res.status(400).send({
                                'message': 'Error al actualizar el DES_USUARIO',
                               
                            }); 
                        }
                        
                    });
                }                
            }
        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });

        }

    },

    delete:async function(req, res){
        //if(req.user.sub == req.params.id){
            const borrar = await pool.query(functions.remove('users', req.params.id));
            return res.status(200).send({
                'message': 'Usuario eliminado exitosamente',
                'user': borrar
            }); 
       /* }else{
            return res.status(400).send({
                'message': 'El DES_USUARIO no tiene permiso para realizar esta acción'
            });
        }*/
    },
    getOne: async function(req, res) {
        const data = await pool.query(`SELECT * FROM users WHERE id = '${req.params.id}'`)
        console.log(data)
        return res.status(200).send({
            'data': data
        });
    }


}

module.exports = user;