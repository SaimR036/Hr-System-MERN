import numpy as np
import tensorflow as tf
from flask import Flask,request
app = Flask(__name__)

@app.route("/getrec",methods=['POST'])
def members():
    data = request.get_json()  # get data from POST request
    print(data)  # access data fields
    Y = np.array(data['Y'])
    X = np.array(data['X'])
    W = np.array(data['W'])
    R = np.array(data['R'])
    B = np.array(data['B'])
    Y = tf.Variable(tf.convert_to_tensor(np.array(data['Y']), dtype=tf.float64))
    X = tf.Variable(tf.convert_to_tensor(np.array(data['X']), dtype=tf.float64))
    W = tf.Variable(tf.convert_to_tensor(np.array(data['W']), dtype=tf.float64))
    R = tf.Variable(tf.convert_to_tensor(np.array(data['R']), dtype=tf.float64))
    B = tf.Variable(tf.convert_to_tensor(np.array([data['B']]), dtype=tf.float64))
    print(W.shape,X.shape,B.shape)
    def sigmoid(x):
        return 1 / (1 + tf.exp(-x))

    def cofi_cost_func_v(X, W, Y,B, R, lambda_):
       
        J=0
        temp = sigmoid(tf.matmul(X,tf.transpose(W))+B)
        J = -1*Y * tf.math.log(temp+ 1e-10) *R - (1-Y)*tf.math.log(1-temp+ 1e-10)*R
        J = tf.reduce_sum(J)
        return J
    def func(X,W,Y,B,R):
        iterations = 100

        lambda_ = 0.02
        num_movies, num_users = Y.shape
        num_features = 5
        tf.random.set_seed(1234) # for consistent results
        # W = tf.Variable(tf.random.normal((num_users,  num_features),dtype=tf.float64),  name='W')
        # X = tf.Variable(tf.random.normal((num_movies, num_features),dtype=tf.float64),  name='X')
        #b = tf.Variable(tf.random.normal((1,          num_users),   dtype=tf.float64),  name='b')

        # Instantiate an optimizer.
        optimizer = tf.keras.optimizers.Adam(learning_rate=1e-2)
        for iter in range(iterations):
            # Use TensorFlow’s GradientTape
            # to record the operations used to compute the cost
            with tf.GradientTape() as tape:

            # Compute the cost (forward pass included in cost)
                cost_value = cofi_cost_func_v(X, W, Y,B, R, lambda_)
    # Use the gradient tape to automatically retrieve
    # the gradients of the trainable variables with respect to the loss
            grads = tape.gradient( cost_value, [X,W,B] )

    # Run one step of gradient descent by updating
    # the value of the variables to minimize the loss.
            optimizer.apply_gradients( zip(grads, [X,W,B]) )

    # Log periodically.
            if iter % 20 == 0:
                print(f"Training loss at iteration {iter}: {cost_value:0.1f}")
        return W,X,B
    A,B,C = func(X,W,Y,B,R)
    return {"W": A.numpy().tolist(), "X": B.numpy().tolist(), "B": C.numpy().tolist()}

if __name__=="__main__":
    app.run(debug=True,port=5000)