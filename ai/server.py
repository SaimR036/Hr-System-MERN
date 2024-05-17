import numpy as np
import tensorflow as tf
from flask import Flask,request
app = Flask(__name__)
@app.route("/getrec",methods=['POST'])
def sigmoid(x):
    return 1 / (1 + tf.exp(-x))

def cofi_cost_func_v(X, W, b, Y, R, lambda_):
    """
    Returns the cost for the content-based filtering
    Vectorized for speed. Uses tensorflow operations to be compatible with custom training loop.
    Args:
      X (ndarray (num_movies,num_features)): matrix of item features
      W (ndarray (num_users,num_features)) : matrix of user parameters
      b (ndarray (1, num_users)            : vector of user parameters
      Y (ndarray (num_movies,num_users)    : matrix of user ratings of movies
      R (ndarray (num_movies,num_users)    : matrix, where R(i, j) = 1 if the i-th movies was rated by the j-th user
      lambda_ (float): regularization parameter
    Returns:
      J (float) : Cost
    """
    J=0
    temp = sigmoid(tf.matmul(X,tf.transpose(W))+b)
    J = -1*Y * tf.math.log(temp) *R - (1-Y)*tf.math.log(1-temp)*R
    J = tf.reduce_sum(J)
    '''for i in range(X.shape[0]):
      for j in range(W.shape[0]):
        if R[i][j]==0:
          temp = sigmoid(tf.linalg.matvec(tf.expand_dims(X[i], axis=0),W[j]) + b[0][j])
          J += -1 * Y[i][j] * tf.math.log(temp) - (1 - Y[i][j]) * tf.math.log(1 - temp)'''
    return J
def func(X,W,Y,R):
    iterations = 500

    lambda_ = 0.002
    num_movies, num_users = Y.shape
    num_features = 5
# Set Initial Parameters (W, X), use tf.Variable to track these variables
    tf.random.set_seed(1234) # for consistent results
    W = tf.Variable(tf.random.normal((num_users,  num_features),dtype=tf.float64),  name='W')
    X = tf.Variable(tf.random.normal((num_movies, num_features),dtype=tf.float64),  name='X')
    b = tf.Variable(tf.random.normal((1,          num_users),   dtype=tf.float64),  name='b')

# Instantiate an optimizer.
    optimizer = tf.keras.optimizers.Adam(learning_rate=1e-3)
    for iter in range(iterations):
    # Use TensorFlow’s GradientTape
    # to record the operations used to compute the cost
        with tf.GradientTape() as tape:

        # Compute the cost (forward pass included in cost)
            cost_value = cofi_cost_func_v(X, W, b, Y, R, lambda_)
    # Use the gradient tape to automatically retrieve
    # the gradients of the trainable variables with respect to the loss
        grads = tape.gradient( cost_value, [X,W,b] )

    # Run one step of gradient descent by updating
    # the value of the variables to minimize the loss.
        optimizer.apply_gradients( zip(grads, [X,W,b]) )

    # Log periodically.
        if iter % 20 == 0:
            print(f"Training loss at iteration {iter}: {cost_value:0.1f}")
    
def members():
    data = request.get_json()  # get data from POST request
    print(data)  # access data fields
    return {"status": data}

if __name__=="__main__":
    app.run(debug=True,port=5000)