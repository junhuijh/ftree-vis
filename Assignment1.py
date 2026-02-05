import networkx as nx
import math

# Help from ChatGPT
def next_label(s):
    s = list(s)
    i = len(s) - 1
    while i >= 0:
        if s[i] != 'Z':
            s[i] = chr(ord(s[i]) + 1)
            return ''.join(s)
        s[i] = 'A'
        i -= 1
    return 'A' + ''.join(s)

# Help from ChatGPT
def previous_label(s):
    s = list(s)
    i = len(s) - 1
    while i >= 0:
        if s[i] != 'A':
            s[i] = chr(ord(s[i]) - 1)
            return ''.join(s)
        s[i] = 'Z'
        i -= 1
    return None

def get_graph(ports:int, depth:int, graph:nx.Graph):
    label = 'A'
    for d in range(depth+1):
        if d!=depth:
            if d == 0:
                number_of_groups = int(math.pow(ports,d))
                number_of_nodes_per_group = int(math.pow(ports//2,depth-d-1))
            else:
                number_of_groups = int(math.pow(ports//2,d)*2)
                number_of_nodes_per_group = int(math.pow(ports//2,depth-d-1))
            number_of_nodes = number_of_groups*number_of_nodes_per_group

            # Create the nodes in the layer
            for node in range(number_of_nodes):
                curr_node = f"{label}{node+1}"
                graph.add_node(curr_node)
                # If it a spine node, you have no parent
                if d==0:
                    pass
                elif d==1:
                    # Spine is artificially split into 
                    # the same number of groups as the number_of_nodes_per_group
                    # each group has ports//2 nodes
                    # Add to first ports//2 nodes of each group
                    group_number = node%number_of_nodes_per_group
                    group_start = group_number*(ports//2)
                    for ii in range(ports//2):
                        parent_label = previous_label(label)
                        parent_node = f"{parent_label}{group_start+ii+1}"
                        graph.add_edge(curr_node,parent_node)
                else:
                    # Parent group is artificially split into 
                    # the same number of groups as the number_of_nodes_per_group
                    # each group has ports//2 nodes
                    # Add to first node of each group
                    number_of_nodes_in_parent = int(math.pow(ports//2,depth-d))
                    parent_start = node//number_of_nodes_in_parent * number_of_nodes_in_parent
                    for ii in range(ports//2):
                        parent_label = previous_label(label)
                        parent_offset = ii*number_of_nodes_per_group+1 + node%number_of_nodes_per_group
                        parent_node = f"{parent_label}{parent_start+parent_offset}"
                        graph.add_edge(curr_node,parent_node)
                    
            label = next_label(label)
        else:
            number_of_nodes = int(math.pow(ports//2,depth-1)*2)
            for node in range(number_of_nodes):
                curr_node = f"{"M"}{node+1}"
                graph.add_node(curr_node)
                parent_label = previous_label(label)
                parent_node = f"{parent_label}{node+1}"
                graph.add_edge(curr_node,parent_node)

print("F(6,4)")
graph = nx.Graph()
get_graph(6,4,graph)
print("Number of Shortest Paths from M1 to M3")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M3"))))

print("Number of Shortest Paths from M1 to M4")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M4"))))
print("Number of Shortest Paths from M1 to M9")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M9"))))

print("Number of Shortest Paths from M1 to M10")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M10"))))
print("Number of Shortest Paths from M1 to M54")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M54"))))

# Drop graph to save memory
del graph
print("F(6,5)")
graph = nx.Graph()
get_graph(6,5,graph)
print("Number of Shortest Paths from M1 to M3")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M3"))))

print("Number of Shortest Paths from M1 to M4")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M4"))))
print("Number of Shortest Paths from M1 to M9")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M9"))))

print("Number of Shortest Paths from M1 to M10")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M10"))))
print("Number of Shortest Paths from M1 to M27")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M27"))))

print("Number of Shortest Paths from M1 to M28")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M28"))))
print("Number of Shortest Paths from M1 to M162")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M162"))))

# Drop graph to save memory
del graph
print("F(4,4)")
graph = nx.Graph()
get_graph(4,4,graph)
print("Number of Shortest Paths from M1 to M2")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M2"))))

print("Number of Shortest Paths from M1 to M3")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M3"))))
print("Number of Shortest Paths from M1 to M4")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M4"))))

print("Number of Shortest Paths from M1 to M5")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M5"))))
print("Number of Shortest Paths from M1 to M16")
print(len(list(nx.all_shortest_paths(graph, source="M1", target="M16"))))

